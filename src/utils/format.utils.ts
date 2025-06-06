import { IManager } from "../interfaces/manager.interface";
import { ICustomer } from "../interfaces/customer.interface";
import { IAdmin } from "../interfaces/admin.interface";

export const formatManagerResponse = (manager: IManager) => {
  const { password, __v, ...managerData } = manager.toObject();
  return {
    _id: managerData._id,
    firstName: managerData.firstName,
    lastName: managerData.lastName,
    email: managerData.email,
    phone: managerData.phone,
    role: managerData.role,
    isActive: managerData.isActive,
    lastLogin: managerData.lastLogin,
    createdAt: managerData.createdAt,
    updatedAt: managerData.updatedAt,
  };
};

export const formatCustomerResponse = (customer: ICustomer) => {
  const { password, __v, ...customerData } = customer.toObject();
  return {
    _id: customerData._id,
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    email: customerData.email,
    phone: customerData.phone,
    role: customerData.role,
    dateOfBirth: customerData.dateOfBirth,
    licenseNumber: customerData.licenseNumber,
    address: customerData.address,
    lastLogin: customerData.lastLogin,
    createdAt: customerData.createdAt,
    updatedAt: customerData.updatedAt,
  };
};

export const formatAdminResponse = (admin: IAdmin) => {
  const { password, __v, ...adminData } = admin.toObject();
  return {
    id: adminData._id,
    email: adminData.email,
    role: adminData.role,
    lastLogin: adminData.lastLogin,
    createdAt: adminData.createdAt,
    updatedAt: adminData.updatedAt,
  };
};
