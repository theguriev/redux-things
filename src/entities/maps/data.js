export const onlyTemplates = items => items?.filter(el => el?.meta?.template === '1') || items

export const initialData = [
    {
        meta: {
            template: '1'
        },
        content: [],
        description: 'The best mind maps plugin in the world',
        id: 'emojis',
        title: 'Emojis ❤️',
        loading: true,
        date: '2021-03-08 17:31:30',
        modified: '2021-03-08 17:31:30'
    },
    {
        meta: {
            template: '1'
        },
        content: [],
        loading: true,
        description: 'Markdown syntaxis in action.',
        id: 'markdown',
        title: 'Markdown 😎💪🏻',
        date: '2021-03-08 17:31:30',
        modified: '2021-03-08 17:31:30'
    },
    {
        meta: {
            template: '1'
        },
        content: [],
        description: 'Uljana is the best :-)',
        id: 'uljana',
        title: 'Uljana ❤️',
        loading: true,
        date: '2021-03-08 17:31:30',
        modified: '2021-03-08 17:31:30'
    }
]
