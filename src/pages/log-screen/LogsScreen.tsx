import React, { useEffect, useState } from 'react';
import NavigationHelper from '../../helpers/NavigationHelper';
import LogsApi from '../../network/LogsApi';
import { DebugType } from 'api';
import Parse from 'console-feed/lib/Hook/parse';
import { Console, Encode } from 'console-feed';
import { numbersToEnglish } from '../../helpers/Utils';

interface Props {
  userId: string
}
function LogsScreen (props: Props) {
  const userId = NavigationHelper.getParam(props, 'userId');
  const [session, setSession] = useState(undefined as { stop: ()=>void, setCB: (cb: (event)=>void) =>void, getCB:()=>any } | undefined);
  const [debugTypes, setDebugTypes] = useState(Object.values(DebugType) as DebugType[]);
  const [logs, setLogs] = useState([] as any[]);

  useEffect(() => {
    if (session) {
      session.setCB((event) => {
        const l = decodeDebug(event);
        if (l) {
          setLogs([...logs, l]);
        } else {
          console.error('ignored', event);
        }
      });
    }
  }, [session, logs]);

  useEffect(() => {
    const ref = {};
    LogsApi.getClientLogs(userId, debugTypes)
      .then((session) => {
        // @ts-ignore
        ref.stop = session.stop;
        setSession(session);
      }).catch((e) => {
        console.log(e);
      });
    return () => {
      // @ts-ignore
      ref.stop && ref.stop();
    };
  }, [debugTypes]);
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#242424' }}>
    <div style={{ flex: 1, padding: '5vw', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#242424' }}>
      <Console logs={logs} logGrouping={false} variant="dark" styles={{ flex: 1, backgroundColor: '#242424' }} />
      {/* {
        logs.map(({ debugType, userType, sockets, data }) => {
          return (
            <Row debugType={debugType} userType={userType} sockets={sockets} data={data}/>
          );
        })
      } */}
      {/* {
        logs.map(({ debugType, userType, sockets, data }) => {
          return(
            <Row debugType={debugType} userType={userType} sockets={sockets} data={data}>
          )
        })
      } */}
    </div>
    </div>
  );
}

const decodeDebug = ({ debugType, userType, sockets, data }) => {
  const def = 'info';
  userType = userType.substring(0, 1);
  try {
    switch (debugType) {
      case DebugType.incoming:
      case DebugType.outgoing:
        if (data.event === 'message') {
          return Parse(def, [numbersToEnglish(`[${sockets}][${userType}][${debugType === DebugType.incoming ? 'Sent' : 'Received'} message]`), data.info.object]);
        } else if (debugType === DebugType.incoming && data.event === DebugType.remote_logs) {
          return Parse(data.info.object.mode, data.info.object.data.map(d => { return typeof d === 'string' ? numbersToEnglish(d) : d; }));
        } else {
          // some other event
          return Parse(def, [numbersToEnglish(`[${sockets}][${userType}][${debugType === DebugType.incoming ? 'Sent' : 'Received'} ${data.event}]}`), data.info.object]);
        }
      case DebugType.presence:
        return Parse(def, [numbersToEnglish(`[${sockets}][${userType}]`), data]);
      /* case DebugType.outgoing:
        printable = ;
        break;
      case DebugType.presence:
        printable = `[${sockets}][${userType}] =  ${data}`;
        break;
       */
      default:
        return Parse(def, [numbersToEnglish(`[${sockets}][${userType}][${debugType === DebugType.incoming ? 'Sent' : 'Received'}] = Unknown debug type`), data]);
    }
  } catch (e) {
    console.log(e);
  }
  return undefined;
};

const Row = ({ debugType, userType, sockets, data }) => {
  const [expanded, setExpanded] = useState(false);
  const [log, setLog] = useState([]);
  let printable;
  let backgroundColor = 'white';
  let textColor = 'black';

  useEffect(() => {
    if (data && data.info && data.info.data) {
      const l = Parse(data.info.mode, data.info.data);
      const encoded = Encode(l);
      // @ts-ignore
      setLog([l]);
    }
  }, [data]);

  switch (debugType) {
    case DebugType.incoming:
      if (data.event === DebugType.remote_logs) {
        console.log(data.info.data);
        printable = `[${sockets}][${userType}][remote-log] =  ${JSON.stringify(data.info.data.join(' , '))}`;
        switch (data.info.mode) {
          case 'error':
            backgroundColor = 'red';
            textColor = 'white';
            break;
          case 'log':
            backgroundColor = 'white';
            textColor = 'black';
            break;
          case 'info':
            backgroundColor = 'blue';
            textColor = 'white';
            break;
          case 'warn':
            backgroundColor = 'orange';
            textColor = 'white';
            break;
          default:
            backgroundColor = 'green';
            textColor = 'white';
            break;
        }
      } else {
        printable = `[${sockets}][${userType}][${data.event}] =  ${JSON.stringify(data.info)}`;
      }
      break;
    case DebugType.outgoing:
      printable = `[${sockets}][${userType}][${data.event}] =  ${JSON.stringify(data.info)}`;
      break;
    case DebugType.presence:
      printable = `[${sockets}][${userType}] =  ${data}`;
      break;
    default:
      printable = `Unknown type ${debugType}`;
      break;
  }
  const lengthLimit = 1000;
  let htmlInput;

  if (data && data.info && data.info.data) {
    htmlInput = format(data.info.data);
    printable = '<br>' + printable;
  } else {
    htmlInput = '<br/>';
  }
};

const format = (args: any[]) => {
  let html = '';
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'object') {
      html += (JSON && JSON.stringify ? JSON.stringify(args[i], undefined, 2) : args[i]) + '<br />';
    } else {
      html += args[i] + '<br />';
    }
  }
  return html;
};

export default React.memo(LogsScreen);
