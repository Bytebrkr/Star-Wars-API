# Star Wars Universe Explorer

A simple web application that explores the Star Wars universe using the SWAPI (Star Wars API). This project features a movie-style intro animation, data visualization of all Star Wars films, and detailed information about characters, planets, and starships.

## Features

- Star Wars-style opening crawl and intro animation
- Display of all Star Wars films in their original release order
- Option to toggle between grid view and horizontal scroll view
- Detailed information about each film including:
  - Characters
  - Planets
  - Starships
- Responsive design for all screen sizes
- Animated starfield background

## Technologies Used

- HTML5
- CSS3 (with animations)
- JavaScript (ES6+)
- SWAPI.tech API
- GSAP Animation Library

## How to Run

1. Clone this repository:
   ```
   git clone https://github.com/Bytebrkr/Star-Wars-API
   ```

2. Navigate to the project directory:
   ```
   cd star-wars-universe-explorer
   ```

3. Open the `index.html` file in your browser:
   - You can use a local server like Live Server in VS Code
   - Or simply open the file directly in your browser:
     ```
     # For macOS
     open index.html
     
     # For Windows
     start index.html
     
     # For Linux
     xdg-open index.html
     ```

4. Alternatively, you can deploy this to GitHub Pages by:
   - Going to your repository settings
   - Scrolling down to the GitHub Pages section
   - Selecting the main branch as the source
   - Clicking Save

## API Usage

This application uses the SWAPI API (https://www.swapi.tech/) to fetch Star Wars data:

- Films: `https://www.swapi.tech/api/films`
- Individual film: `https://www.swapi.tech/api/films/{id}`
- Characters, planets, and starships are fetched from URLs provided in the film data
