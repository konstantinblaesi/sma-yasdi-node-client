module.exports = {
    mqtt: {
        protocol: "mqtt",
        hostname: "konstantin-nas",
        port: 1883,
        username: "sma-logger",
        password: "sma-logger",
        topicPrefix: "Solar/Inverters"
    },
    influxDB: {
        host: "konstantin-nas",
        port: 8086,
        database: "foo_db",
        username: "foo_user",
        password: "foo_pass",
        retentionPolicies: [
            {
                name: "20years",
                duration: "1040w",
                replication: 1
            }
        ],
        schemas: [
            {
                measurement: "inverters",
                fields: [
                    "Upv-Soll",
                    "Iac-Ist",
                    "Uac",
                    "Fac",
                    "Pac",
                    "Riso",
                    "Ipv",
                    "E-Total",
                    "h-Total",
                    "h-On",
                    "Netz-Ein",
                    "Status",
                    "Fehler",
                    "Zac"
                ],
                "retentionPolicy": "20years"
            }
        ]
    }
};