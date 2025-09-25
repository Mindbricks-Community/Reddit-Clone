const { elasticClient } = require("common/elasticsearch");

const runAllRepair = async () => {
  console.group("Repair started at ", new Date());

  console.groupEnd();
};

// check index is exists and create if not exists
const checkIndex = async (index) => {
  const result = await elasticClient.indices.exists({ index });
  if (!result) {
    console.log("Index not found, creating index", index);
    await elasticClient.indices.create({ index });
    return;
  }
  console.log("Index found, skipping creation", index);
};

module.exports = { runAllRepair };
