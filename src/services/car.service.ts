import Car from "../models/Car";
import Category from "../models/Category";
import {
  CreateCarInput,
  UpdateCarInput,
} from "../schemas/validation/car.validation";
import { UserRole } from "../enums/role.enum";

export class CarService {
  async createCar(carData: CreateCarInput, userId: string, userRole: UserRole) {
    // Check if category exists
    const category = await Category.findById(carData.category);
    if (!category) {
      throw new Error("Category not found");
    }

    const car = new Car({
      ...carData,
      addedBy: {
        user: userId,
        role: userRole,
      },
    });
    return await car.save();
  }

  async getCars(query: any) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { make: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { vin: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const cars = await Car.find(filter)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Car.countDocuments(filter);

    return {
      cars,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getCarById(id: string) {
    const car = await Car.findById(id);
    if (!car) {
      throw new Error("Car not found");
    }
    return car;
  }

  async updateCar(id: string, carData: UpdateCarInput) {
    const car = await Car.findByIdAndUpdate(
      id,
      { $set: carData },
      { new: true, runValidators: true }
    );
    if (!car) {
      throw new Error("Car not found");
    }
    return car;
  }

  async deleteCar(id: string) {
    const car = await Car.findByIdAndDelete(id);
    if (!car) {
      throw new Error("Car not found");
    }
    return car;
  }

  async getCarsByCategory(category: string) {
    return await Car.find({ category });
  }
}
