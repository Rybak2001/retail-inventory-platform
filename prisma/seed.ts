import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding inventory database...");

  await prisma.movement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPass = await bcrypt.hash("admin123", 12);
  const managerPass = await bcrypt.hash("manager123", 12);
  const employeePass = await bcrypt.hash("employee123", 12);

  const admin = await prisma.user.create({
    data: { email: "admin@stockcontrol.com", password: adminPass, name: "Administrador", role: "admin" },
  });
  const manager = await prisma.user.create({
    data: { email: "gestor@stockcontrol.com", password: managerPass, name: "María García", role: "manager" },
  });
  const employee = await prisma.user.create({
    data: { email: "empleado@stockcontrol.com", password: employeePass, name: "Carlos López", role: "employee" },
  });

  console.log(`✅ Created 3 users (admin, manager, employee)`);

  const products = [
    { name: "Laptop HP ProBook 450", sku: "LAP-HP-001", category: "Electrónica", unit: "unidad", price: 12500, stock: 15, minStock: 5, description: "Laptop empresarial i5, 16GB RAM, 512GB SSD" },
    { name: "Monitor Dell 24\" FHD", sku: "MON-DL-001", category: "Electrónica", unit: "unidad", price: 3200, stock: 22, minStock: 8, description: "Monitor IPS Full HD 24 pulgadas" },
    { name: "Teclado Logitech K380", sku: "TEC-LG-001", category: "Periféricos", unit: "unidad", price: 650, stock: 45, minStock: 15, description: "Teclado Bluetooth multi-dispositivo" },
    { name: "Mouse Logitech M720", sku: "MOU-LG-001", category: "Periféricos", unit: "unidad", price: 890, stock: 3, minStock: 10, description: "Mouse inalámbrico ergonómico" },
    { name: "Cable HDMI 2.0 (2m)", sku: "CAB-HD-001", category: "Cables", unit: "unidad", price: 120, stock: 80, minStock: 20, description: "Cable HDMI de alta velocidad 4K" },
    { name: "Cable USB-C (1m)", sku: "CAB-UC-001", category: "Cables", unit: "unidad", price: 85, stock: 120, minStock: 30, description: "Cable USB tipo C carga rápida" },
    { name: "Webcam Logitech C920", sku: "CAM-LG-001", category: "Periféricos", unit: "unidad", price: 1450, stock: 2, minStock: 5, description: "Webcam Full HD 1080p" },
    { name: "Docking Station USB-C", sku: "DOC-GN-001", category: "Electrónica", unit: "unidad", price: 2800, stock: 8, minStock: 3, description: "Hub USB-C 12 en 1" },
    { name: "Resma Papel A4 (500h)", sku: "PAP-A4-001", category: "Papelería", unit: "resma", price: 65, stock: 200, minStock: 50, description: "Papel bond A4 75g" },
    { name: "Tóner HP 26A", sku: "TON-HP-001", category: "Papelería", unit: "unidad", price: 580, stock: 12, minStock: 5, description: "Tóner original para HP LaserJet" },
    { name: "Silla Ergonómica Pro", sku: "SIL-ER-001", category: "Mobiliario", unit: "unidad", price: 4500, stock: 6, minStock: 2, description: "Silla de oficina con soporte lumbar" },
    { name: "Escritorio Ajustable", sku: "ESC-AJ-001", category: "Mobiliario", unit: "unidad", price: 7800, stock: 4, minStock: 2, description: "Escritorio sit-stand eléctrico 120x60cm" },
  ];

  const userIds = [admin.id, manager.id, employee.id];

  for (const p of products) {
    const product = await prisma.product.create({ data: p });

    // Create some movements for each product
    await prisma.movement.create({
      data: { type: "entry", quantity: p.stock + 10, reason: "Stock inicial", productId: product.id, userId: userIds[Math.floor(Math.random() * userIds.length)] },
    });
    if (Math.random() > 0.3) {
      await prisma.movement.create({
        data: { type: "exit", quantity: Math.floor(Math.random() * 8) + 1, reason: "Venta", productId: product.id, userId: userIds[Math.floor(Math.random() * userIds.length)] },
      });
    }
    if (Math.random() > 0.5) {
      await prisma.movement.create({
        data: { type: "exit", quantity: Math.floor(Math.random() * 5) + 1, reason: "Transferencia a sucursal", productId: product.id, userId: userIds[Math.floor(Math.random() * userIds.length)] },
      });
    }
  }

  console.log(`✅ Created ${products.length} products with movements`);
  console.log("🎉 Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
