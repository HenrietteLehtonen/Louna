import promisePool from './database.js';
async function querryPool(sql, params = []) {
  try {
    const result = await promisePool.query(sql, params);
    return result;
  } catch (error) {
    console.error('Debug', error.message);
    throw new Error('Database error ' + error.message);
  }
}

export {querryPool};
