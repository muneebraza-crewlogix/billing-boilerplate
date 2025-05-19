import Stripe from 'stripe';
import { stripe } from '@/config/stripe';
import { Product, IProduct } from '@/models/Product';

export interface CreateProductDTO {
  key: string;
  name: string;
  metadata?: Record<string, any>;
}

export class ProductService {
  public async createProduct(dto: CreateProductDTO): Promise<IProduct> {
    // 1️⃣ Create local Mongo Product
    const product = await Product.create({
      key: dto.key,
      name: dto.name,
      metadata: dto.metadata || {}
    });

    // 2️⃣ Create Stripe Product
    const stripeProduct = await stripe.products.create({
      name: dto.name,
      metadata: { localProductId: product.id, ...dto.metadata }
    });

    // 3️⃣ Persist stripeProductId
    product.metadata = { ...product.metadata, stripeProductId: stripeProduct.id };
    await product.save();

    return product;
  }

  public async listProducts(): Promise<IProduct[]> {
    return Product.find().sort({ createdAt: -1 }).exec();
  }
}

export const productService = new ProductService();