const prompt = require('prompt-sync')();


const movies = [
    {
        title: "The Shawshank Redemption",
        cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"]
    },
    {
        title: "The Godfather",
        cast: ["Marlon Brando", "Al Pacino", "James Caan"]
    },
    {
        title: "The Dark Knight",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
    },
    {
        title: "Se7en",
        cast: ["Brad Pitt", "Morgan Freeman", "Kevin Spacey"]
    },
    {
        title: "The Green Mile",
        cast: ["Tom Hanks", "Michael Clarke Duncan", "David Morse"]
    }
];


function queryMoviesByActor(actorName, M) {
    const actorMovies = movies.filter(movie => movie.cast.includes(actorName)).slice(0, M);
    return actorMovies.map(movie => movie.title);
}


function main() {
    const actorName = prompt('Enter actor name: ');
    const M = parseInt(prompt('Enter the number of movies (M): '), 10);


    const result = queryMoviesByActor(actorName, M);
    
 
    console.log(`Top ${M} movies for "${actorName}": ${result.join(', ')}`);
    
}

main();