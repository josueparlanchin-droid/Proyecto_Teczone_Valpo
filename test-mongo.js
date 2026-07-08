import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const uriSrv = process.env.MONGODB_URI;

async function run() {
  console.log("🔌 Conectando a MongoDB Atlas...\n");
  const client = new MongoClient(uriSrv, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    tlsAllowInvalidCertificates: true,
  });

  try {
    await client.connect();
    console.log("✅ Conexión exitosa!\n");

    // Listar bases de datos
    const admin = client.db().admin();
    const dbsInfo = await admin.listDatabases();
    console.log("📦 Bases de datos visibles:");
    for (const db of dbsInfo.databases) {
      console.log(`   🗄️  "${db.name}" (size: ${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    }

    // También intentar acceder a sample_mflix directamente
    console.log("\n🔍 Intentando acceder a 'sample_mflix'...");
    const sampleDb = client.db("sample_mflix");
    const sampleCols = await sampleDb.listCollections().toArray();
    if (sampleCols.length > 0) {
      console.log(`   ✅ Encontradas ${sampleCols.length} colecciones:`);
      for (const col of sampleCols) {
        const count = await sampleDb.collection(col.name).countDocuments();
        console.log(`      📁 ${col.name}: ${count} documentos`);
        if (count > 0) {
          const docs = await sampleDb.collection(col.name).find().limit(2).toArray();
          console.log(`         Muestra: ${JSON.stringify(docs, null, 4)}`);
        }
      }
    } else {
      console.log("   ⚠️  No hay colecciones en sample_mflix");
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
    console.log("\n🔌 Conexión cerrada");
  }
}

run();
