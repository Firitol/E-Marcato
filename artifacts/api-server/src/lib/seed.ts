import { db } from "@workspace/db";
import {
  usersTable,
  categoriesTable,
  sellersTable,
  productsTable,
  reviewsTable,
  ordersTable,
  orderItemsTable,
} from "@workspace/db";
import { hashPassword } from "./auth.js";

export async function seedDatabase() {
  try {
    // Check if already seeded
    const existingUsers = await db.select().from(usersTable).limit(1);
    if (existingUsers.length > 0) return;

    console.log("Seeding database...");

    // Create users
    const [admin] = await db.insert(usersTable).values({
      email: "admin@ethiomart.com",
      password: hashPassword("admin123"),
      firstName: "Admin",
      lastName: "EthioMart",
      role: "admin",
      phone: "+251911000001",
      city: "Addis Ababa",
    }).returning();

    const [seller1User] = await db.insert(usersTable).values({
      email: "seller1@ethiomart.com",
      password: hashPassword("seller123"),
      firstName: "Abebe",
      lastName: "Tadesse",
      role: "seller",
      phone: "+251911000002",
      city: "Addis Ababa",
    }).returning();

    const [seller2User] = await db.insert(usersTable).values({
      email: "seller2@ethiomart.com",
      password: hashPassword("seller123"),
      firstName: "Tigist",
      lastName: "Haile",
      role: "seller",
      phone: "+251911000003",
      city: "Dire Dawa",
    }).returning();

    const [customer1] = await db.insert(usersTable).values({
      email: "customer@ethiomart.com",
      password: hashPassword("customer123"),
      firstName: "Dawit",
      lastName: "Bekele",
      role: "customer",
      phone: "+251911000004",
      city: "Addis Ababa",
    }).returning();

    // Create categories
    const categoryData = [
      { name: "Electronics", slug: "electronics", icon: "📱" },
      { name: "Fashion", slug: "fashion", icon: "👗" },
      { name: "Home & Garden", slug: "home-garden", icon: "🏠" },
      { name: "Food & Beverages", slug: "food-beverages", icon: "🍎" },
      { name: "Health & Beauty", slug: "health-beauty", icon: "💄" },
      { name: "Sports & Outdoors", slug: "sports-outdoors", icon: "⚽" },
      { name: "Books & Education", slug: "books-education", icon: "📚" },
      { name: "Automotive", slug: "automotive", icon: "🚗" },
      { name: "Baby & Kids", slug: "baby-kids", icon: "🧸" },
      { name: "Traditional Crafts", slug: "traditional-crafts", icon: "🎨" },
    ];

    const categories = await db.insert(categoriesTable).values(categoryData).returning();

    // Create sellers
    const [seller1] = await db.insert(sellersTable).values({
      userId: seller1User.id,
      storeName: "Abebe Electronics",
      storeDescription: "Your trusted electronics store in Addis Ababa. We sell phones, laptops, and accessories.",
      category: "Electronics",
      phone: "+251911000002",
      address: "Bole Road, Near Airport",
      city: "Addis Ababa",
      status: "approved",
      rating: "4.5",
      totalSales: 234,
    }).returning();

    const [seller2] = await db.insert(sellersTable).values({
      userId: seller2User.id,
      storeName: "Tigist Fashion House",
      storeDescription: "Traditional and modern Ethiopian fashion. Habesha kemis, modern clothes and accessories.",
      category: "Fashion",
      phone: "+251911000003",
      address: "Merkato Area",
      city: "Dire Dawa",
      status: "approved",
      rating: "4.8",
      totalSales: 567,
    }).returning();

    // Create products
    const productImages = [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
    ];

    const electronicsCategory = categories.find(c => c.slug === "electronics")!;
    const fashionCategory = categories.find(c => c.slug === "fashion")!;
    const homeCategory = categories.find(c => c.slug === "home-garden")!;
    const foodCategory = categories.find(c => c.slug === "food-beverages")!;
    const healthCategory = categories.find(c => c.slug === "health-beauty")!;
    const craftsCategory = categories.find(c => c.slug === "traditional-crafts")!;

    const productsData = [
      {
        name: "Samsung Galaxy A54 5G",
        slug: "samsung-galaxy-a54-5g",
        description: "Experience the future with Samsung Galaxy A54 5G. Features a 6.4-inch Super AMOLED display, 50MP camera, and all-day battery life.",
        price: "8500.00",
        originalPrice: "9999.00",
        discount: 15,
        stock: 50,
        categoryId: electronicsCategory.id,
        sellerId: seller1.id,
        images: [productImages[0], productImages[6]],
        tags: ["smartphone", "5g", "samsung", "android"],
        rating: "4.5",
        reviewCount: 45,
        sold: 123,
        featured: true,
        status: "active",
        specifications: { "Screen": "6.4 inch", "RAM": "8GB", "Storage": "256GB", "Battery": "5000mAh" },
      },
      {
        name: "Wireless Bluetooth Earbuds",
        slug: "wireless-bluetooth-earbuds",
        description: "Premium wireless earbuds with active noise cancellation, 30-hour battery, and crystal clear sound.",
        price: "1200.00",
        originalPrice: "1800.00",
        discount: 33,
        stock: 120,
        categoryId: electronicsCategory.id,
        sellerId: seller1.id,
        images: [productImages[1]],
        tags: ["earbuds", "wireless", "bluetooth", "audio"],
        rating: "4.3",
        reviewCount: 89,
        sold: 456,
        featured: true,
        status: "active",
        specifications: { "Battery": "30 hours", "Connectivity": "Bluetooth 5.0", "Noise Cancellation": "Yes" },
      },
      {
        name: "Traditional Habesha Kemis",
        slug: "traditional-habesha-kemis",
        description: "Beautiful hand-woven traditional Ethiopian dress with intricate Tibeb border. Perfect for holidays and ceremonies.",
        price: "3500.00",
        originalPrice: "4500.00",
        discount: 22,
        stock: 30,
        categoryId: fashionCategory.id,
        sellerId: seller2.id,
        images: [productImages[3]],
        tags: ["habesha", "kemis", "traditional", "dress", "ethiopian"],
        rating: "4.9",
        reviewCount: 156,
        sold: 234,
        featured: true,
        status: "active",
        specifications: { "Material": "Cotton", "Origin": "Handmade in Ethiopia", "Care": "Gentle wash" },
      },
      {
        name: "Ethiopian Coffee Gift Set",
        slug: "ethiopian-coffee-gift-set",
        description: "Premium Yirgacheffe coffee gift set including traditional jebena (coffee pot) and 500g of freshly roasted beans.",
        price: "890.00",
        originalPrice: "1200.00",
        discount: 26,
        stock: 200,
        categoryId: foodCategory.id,
        sellerId: seller2.id,
        images: [productImages[7]],
        tags: ["coffee", "yirgacheffe", "gift", "traditional"],
        rating: "5.0",
        reviewCount: 234,
        sold: 789,
        featured: true,
        status: "active",
        specifications: { "Weight": "500g", "Origin": "Yirgacheffe, Ethiopia", "Roast": "Medium" },
      },
      {
        name: "Smart Watch Pro 2024",
        slug: "smart-watch-pro-2024",
        description: "Feature-packed smartwatch with health monitoring, GPS, and 7-day battery life.",
        price: "3200.00",
        originalPrice: "4500.00",
        discount: 29,
        stock: 75,
        categoryId: electronicsCategory.id,
        sellerId: seller1.id,
        images: [productImages[1]],
        tags: ["smartwatch", "fitness", "gps", "health"],
        rating: "4.4",
        reviewCount: 67,
        sold: 89,
        featured: false,
        status: "active",
        specifications: { "Battery": "7 days", "GPS": "Built-in", "Water Resistance": "IP68" },
      },
      {
        name: "Laptop Stand Adjustable",
        slug: "laptop-stand-adjustable",
        description: "Ergonomic aluminum laptop stand, adjustable height and angle, compatible with all laptops.",
        price: "650.00",
        originalPrice: "850.00",
        discount: 24,
        stock: 150,
        categoryId: electronicsCategory.id,
        sellerId: seller1.id,
        images: [productImages[4]],
        tags: ["laptop", "stand", "ergonomic", "desk"],
        rating: "4.6",
        reviewCount: 112,
        sold: 345,
        featured: false,
        status: "active",
        specifications: { "Material": "Aluminum", "Compatibility": "10-17 inch laptops", "Adjustable": "Yes" },
      },
      {
        name: "Ethiopian Honey 1kg",
        slug: "ethiopian-honey-1kg",
        description: "Pure organic honey from the forests of Ethiopia. Collected by local beekeepers using traditional methods.",
        price: "280.00",
        originalPrice: "350.00",
        discount: 20,
        stock: 500,
        categoryId: foodCategory.id,
        sellerId: seller2.id,
        images: [productImages[7]],
        tags: ["honey", "organic", "natural", "ethiopian"],
        rating: "4.8",
        reviewCount: 445,
        sold: 1234,
        featured: false,
        status: "active",
        specifications: { "Weight": "1kg", "Type": "Raw Forest Honey", "Origin": "Western Ethiopia" },
      },
      {
        name: "Modern Shawl - Netela",
        slug: "modern-shawl-netela",
        description: "Elegant traditional Ethiopian netela shawl with modern design. Versatile for daily wear and special occasions.",
        price: "450.00",
        originalPrice: "600.00",
        discount: 25,
        stock: 80,
        categoryId: fashionCategory.id,
        sellerId: seller2.id,
        images: [productImages[3]],
        tags: ["netela", "shawl", "traditional", "ethiopian"],
        rating: "4.7",
        reviewCount: 78,
        sold: 156,
        featured: false,
        status: "active",
        specifications: { "Material": "Cotton", "Size": "2x1 meters", "Pattern": "Traditional Tibeb" },
      },
      {
        name: "Wireless Charging Pad",
        slug: "wireless-charging-pad",
        description: "Fast wireless charging pad compatible with all Qi-enabled devices. 15W fast charge.",
        price: "420.00",
        originalPrice: "550.00",
        discount: 24,
        stock: 200,
        categoryId: electronicsCategory.id,
        sellerId: seller1.id,
        images: [productImages[0]],
        tags: ["charging", "wireless", "qi", "fast-charge"],
        rating: "4.2",
        reviewCount: 34,
        sold: 67,
        featured: false,
        status: "active",
        specifications: { "Power": "15W", "Compatibility": "All Qi devices", "Cable": "USB-C included" },
      },
      {
        name: "Ethiopian Injera Making Kit",
        slug: "ethiopian-injera-making-kit",
        description: "Complete kit for making traditional Ethiopian injera at home. Includes teff flour, starter culture, and mitad.",
        price: "1200.00",
        originalPrice: "1500.00",
        discount: 20,
        stock: 60,
        categoryId: homeCategory.id,
        sellerId: seller2.id,
        images: [productImages[7]],
        tags: ["injera", "cooking", "traditional", "ethiopian", "kitchen"],
        rating: "4.6",
        reviewCount: 89,
        sold: 145,
        featured: false,
        status: "active",
        specifications: { "Contents": "Teff flour, Starter, Pan", "Serves": "6-8 people", "Instructions": "Included" },
      },
    ];

    const products = await db.insert(productsTable).values(productsData as any).returning();

    // Create sample reviews
    const reviewData = [
      { productId: products[0].id, userId: customer1.id, rating: 5, comment: "Excellent phone! Great camera and battery life.", verifiedPurchase: true },
      { productId: products[1].id, userId: customer1.id, rating: 4, comment: "Very good earbuds. Noise cancellation works great.", verifiedPurchase: true },
      { productId: products[2].id, userId: customer1.id, rating: 5, comment: "Beautiful dress! Perfect for my daughter's wedding.", verifiedPurchase: true },
      { productId: products[3].id, userId: customer1.id, rating: 5, comment: "Best coffee I have ever tasted! Very authentic.", verifiedPurchase: true },
    ];

    await db.insert(reviewsTable).values(reviewData);

    // Create sample order
    await db.insert(ordersTable).values({
      orderNumber: "ETH-2024-00001",
      userId: customer1.id,
      status: "delivered",
      paymentStatus: "paid",
      paymentMethod: "telebirr",
      subtotal: "8500.00",
      shipping: "150.00",
      total: "8650.00",
      shippingAddress: {
        fullName: "Dawit Bekele",
        phone: "+251911000004",
        street: "Bole Road, House 123",
        city: "Addis Ababa",
        region: "Addis Ababa",
        country: "Ethiopia",
      },
      trackingNumber: "ETH123456789",
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seed error:", error);
  }
}
