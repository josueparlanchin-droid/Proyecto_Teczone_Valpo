import { MongoClient } from "mongodb";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = "mongodb+srv://josue:Josue2025..@valpo.cz5in6s.mongodb.net/?appName=Valpo";

async function run() {
  console.log("🔌 Conectando...\n");
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    tlsAllowInvalidCertificates: true,
  });

  try {
    await client.connect();
    console.log("✅ Conectado!\n");

    const admin = client.db().admin();
    const { databases } = await admin.listDatabases();
    console.log("📦 Bases de datos:");
    for (const dbInfo of databases) {
      const db = client.db(dbInfo.name);
      const cols = await db.listCollections().toArray();
      console.log(`   🗄️  "${dbInfo.name}" (${cols.length} colecciones)`);
      for (const col of cols) {
        const count = await db.collection(col.name).countDocuments();
        const docs = await db.collection(col.name).find().limit(3).toArray();
        console.log(`      📁 ${col.name}: ${count} documentos`);
        if (docs.length) console.log(JSON.stringify(docs, null, 4).slice(0, 300));
      }
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
    console.log("\n🔌 Desconectado");
  }
}

run();
