export default {
  input: 'src/worker.js',
  output: {
    file: 'tcmWorker.js',
    format: 'esm',
    name: "tomCM"
  }
};