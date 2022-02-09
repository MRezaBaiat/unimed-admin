// @ts-nocheck

const createPrivilegeOptionDetails = (positive: boolean) => {
  return {
    allowed: positive,
    whiteList: []
  };
};

const createPrivilegeOptions = (positive: boolean) => {
  return {
    post: createPrivilegeOptionDetails(positive),
    patch: createPrivilegeOptionDetails(positive),
    delete: createPrivilegeOptionDetails(positive),
    get: createPrivilegeOptionDetails(positive),
    menuVisible: positive
  };
};

const adminDefault = {
  users: createPrivilegeOptions(true),
  admins: createPrivilegeOptions(false),
  visits: createPrivilegeOptions(true),
  medicalServices: createPrivilegeOptions(true),
  healthCenters: createPrivilegeOptions(true),
  adminLogs: createPrivilegeOptions(true),
  discounts: createPrivilegeOptions(true),
  serverConfigs: createPrivilegeOptions(true),
  serviceRequests: createPrivilegeOptions(true),
  specializations: createPrivilegeOptions(true),
  transactions: createPrivilegeOptions(true),
  notifications: createPrivilegeOptions(true),
  reservations: createPrivilegeOptions(true),
  analytics: createPrivilegeOptions(true),
  calls: createPrivilegeOptions(true)
};

const managerDefault = {
  users: createPrivilegeOptions(true),
  admins: createPrivilegeOptions(true),
  visits: createPrivilegeOptions(true),
  medicalServices: createPrivilegeOptions(true),
  healthCenters: createPrivilegeOptions(true),
  adminLogs: createPrivilegeOptions(true),
  discounts: createPrivilegeOptions(true),
  serverConfigs: createPrivilegeOptions(true),
  serviceRequests: createPrivilegeOptions(true),
  specializations: createPrivilegeOptions(true),
  transactions: createPrivilegeOptions(true),
  notifications: createPrivilegeOptions(true),
  reservations: createPrivilegeOptions(true),
  analytics: createPrivilegeOptions(false),
  calls: createPrivilegeOptions(true)
};

const healthCenterDefault = {
  users: createPrivilegeOptions(false),
  admins: createPrivilegeOptions(false),
  visits: createPrivilegeOptions(false),
  medicalServices: createPrivilegeOptions(false),
  healthCenters: createPrivilegeOptions(true),
  adminLogs: createPrivilegeOptions(false),
  discounts: createPrivilegeOptions(false),
  serverConfigs: createPrivilegeOptions(false),
  serviceRequests: createPrivilegeOptions(false),
  specializations: createPrivilegeOptions(false),
  transactions: createPrivilegeOptions(false),
  notifications: createPrivilegeOptions(false),
  reservations: createPrivilegeOptions(false),
  analytics: createPrivilegeOptions(false),
  calls: createPrivilegeOptions(false)
};

export default {
  HEALTHCENTER: healthCenterDefault,
  ADMIN: adminDefault,
  MANAGER: managerDefault
};
