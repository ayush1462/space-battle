export const Levels = [
    {
        id: 1,
        name: "Training Zone",
        
        waves: [
            {
                duration: 15000,
                maxAlive: 5,
                spawnInterval: 2000,
                enemyTypes: ["chaser"]
            },
            {
                duration: 20000,
                maxAlive: 8,
                spawnInterval: 1500,
                enemyTypes: ["chaser", "shooter"]
            },
            {
                duration: 25000,
                maxAlive: 8,
                spawnInterval: 1000,
                enemyTypes: ["chaser", "shooter"]
            },
        ]
        
    }
]