// PM2 config
module.exports = {
  apps: [
    {
      name: 'planetsclub-web',
      script: './node_modules/.bin/nuxt',
      args: 'start --port 3005 --modern=server',
      exec_mode: 'cluster',
      instances: 0,
      // autorestart: true,
      // watch: false,
      // max_memory_restart: "1G",
      instance_var: 'INSTANCE_ID',
      env: {
        // NODE_ENV: "production",
      }
    }
  ]
}
