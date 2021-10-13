let books = [
    {
        ISBN : "12345Book",
        title : "Getting started with MERN",
        pubDate : "2021-07-07",
        language : "en",
        numPage : 250,
        author: [1,2],
        publication : [1],
        category : ["tech", "programming", "education", "thriller"],
    },
] ; 

const authors = [
    {
        id : 1,
        name : "Tanisha",
        books : ["12345Book","123456789Secret"],
    },
    {
        id : 2,
        name : "Elon Musk",
        books : ["12345Book"],
    },
];

const publications = [
    {
        id : 1,
        name : "writex",
        books : ["12345Book"],
    },
    {
        id : 2,
        name : "purple",
        books : [],
    },
];

module.exports = { books , authors , publications };
