const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A single point/time series metric (CPU, memory, error rate, etc.) collected from any service/module/host. Supports custom tags for dimensional filtering.
const SystemMetric = sequelize.define(
  "systemMetric",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    timestamp: {
      // ISO timestamp for when the metric was captured.
      type: DataTypes.DATE,
      allowNull: false,
    },
    serviceName: {
      // Internal name of the service emitting the metric.
      type: DataTypes.STRING,
      allowNull: false,
    },
    host: {
      // Hostname, k8s pod, or node identifier as reported by the agent/system.
      type: DataTypes.STRING,
      allowNull: true,
    },
    metricName: {
      // Application or system metric name (e.g., cpuUsage, httpReqDuration).
      type: DataTypes.STRING,
      allowNull: false,
    },
    metricValue: {
      // Captured value of the metric (number, e.g., usage%, count, latency ms).
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    unit: {
      // Unit or suffix for the metric value (e.g., ms, %, count).
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      // Flexible object for custom metric tagging/dimension/labels (json: {route:..., method:..., env:...}).
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["timestamp"],
      },
      {
        unique: false,
        fields: ["serviceName"],
      },
      {
        unique: false,
        fields: ["metricName"],
      },

      {
        unique: true,
        fields: ["serviceName", "metricName", "timestamp"],
        where: { isActive: true },
      },
    ],
  },
);

module.exports = SystemMetric;
