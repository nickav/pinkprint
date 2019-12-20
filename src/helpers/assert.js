/** Simple assert funciton. */
module.exports = (truthy, error) => {
  if (truthy) return;
  console.error(error);
  process.exit(1);
};
