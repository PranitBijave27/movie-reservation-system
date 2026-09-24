const mongoose = require("mongoose");

/**
 * Checks whether the active MongoDB connection supports transactions.
 * Transactions require a Replica Set (Atlas, Docker rs, or mongos sharded cluster).
 * Standalone/Single-node instances (common in local dev) do not support sessions with transactions.
 */
const isReplicaSet = () => {
    const type = mongoose.connection?.client?.topology?.description?.type;
    return type === "ReplicaSetWithPrimary" || type === "Sharded";
};

/**
 * Executes operations with transactions on Replica Sets
 * and safely falls back for standalone MongoDB.
 *
 * @param {Function} callback - async (session) => { ... }
 * @returns {Promise<*>} Callback result
 */
const withTransaction = async (callback) => {
    if (!isReplicaSet()) {
        return await callback(null);
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const result = await callback(session);
        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

module.exports = { isReplicaSet, withTransaction };
