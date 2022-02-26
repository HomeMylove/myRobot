const rank = [{
        win: 12,
        draw: 4,
        lose: 13,
        rate: 0.41379310344827586,
        user_id: '2324178841'
    },
    { win: 1, draw: 0, lose: 1, rate: 0.5, user_id: '373744833' },
    { win: 3, draw: 1, lose: 0, rate: 0.75, user_id: '2796741985' },
    { win: 0, draw: 3, lose: 2, rate: 0, user_id: '2068853871' },
    { win: 3, draw: 4, lose: 3, rate: 0.3, user_id: '3128114236' },
    { win: 1, draw: 0, lose: 0, rate: 0, user_id: '2307314390' },
    {
        win: 20,
        draw: 13,
        lose: 23,
        rate: 0.35714285714285715,
        user_id: '3102734141'
    },
    { win: 1, draw: 0, lose: 0, rate: 0, user_id: '463449748' },
    { win: 3, draw: 1, lose: 0, rate: 0.75, user_id: '936605227' },
    { win: 0, draw: 0, lose: 1, rate: 0, user_id: '3184059686' }
]


const newRank = rank.sort((a, b) => {
    return a.rate - b.rate
})

console.log(newRank);