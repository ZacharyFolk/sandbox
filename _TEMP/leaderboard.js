async function insertScore(initials, time, hearts) {
    const db = await connect();
    const collectionName = 'leaderboard';
    const leaderboard = db.collection(collectionName);
  
    // Check if the collection exists, if not, create it
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === collectionName);
    if (!collectionExists) {
      await db.createCollection(collectionName);
    }
  
    // Insert the document into the collection
    await leaderboard.insertOne({ initials, time, hearts });
  }
  