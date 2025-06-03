import Customer from "../models/Customer";
import Manager from "../models/Manager";
import {
  formatCustomerResponse,
  formatManagerResponse,
} from "../utils/format.utils";

export class UserService {
  async getAllCustomers() {
    const customers = await Customer.find();
    return customers.map((customer) => formatCustomerResponse(customer));
  }

  async getCustomerById(id: string) {
    const customer = await Customer.findById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return formatCustomerResponse(customer);
  }

  async getAllManagers() {
    const managers = await Manager.find();
    return managers.map((manager) => formatManagerResponse(manager));
  }

  async getManagerById(id: string) {
    const manager = await Manager.findById(id);
    if (!manager) {
      throw new Error("Manager not found");
    }
    return formatManagerResponse(manager);
  }
}
