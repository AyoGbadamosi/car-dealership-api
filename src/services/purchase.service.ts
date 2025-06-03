import Purchase from "../models/Purchase";
import Car from "../models/Car";
import { CarStatus } from "../enums/car.enum";

export class PurchaseService {
  async createPurchase(
    carId: string,
    customerId: string,
    purchasePrice: number,
    paymentMethod: string
  ) {
    const car = await Car.findById(carId);
    if (!car) {
      throw new Error("Car not found");
    }

    if (car.status !== CarStatus.AVAILABLE) {
      throw new Error("Car is not available for purchase");
    }

    if (car.price !== purchasePrice) {
      throw new Error("Purchase price does not match car price");
    }

    const purchase = await Purchase.create({
      carId,
      customerId,
      purchasePrice,
      paymentMethod,
    });

    car.status = CarStatus.SOLD;
    await car.save();

    return purchase;
  }

  async getPurchaseById(id: string) {
    const purchase = await Purchase.findById(id)
      .populate("carId", "make model year price")
      .populate("customerId", "firstName lastName email");

    if (!purchase) {
      throw new Error("Purchase not found");
    }

    return purchase;
  }

  async getCustomerPurchases(customerId: string) {
    return await Purchase.find({ customerId })
      .populate("carId", "make model year price")
      .sort({ purchaseDate: -1 });
  }

  async getAllPurchases() {
    return await Purchase.find()
      .populate("carId", "make model year price")
      .populate("customerId", "firstName lastName email")
      .sort({ purchaseDate: -1 });
  }
}
