const main = document.querySelector(".main");
const card = document.querySelector(".card");
const searchBar = document.getElementById("searchBar");
const dispNum = document.getElementById("displayNum");
let select = document.querySelector("#select");
let shows = [];

searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();

  const filteredShows = shows.filter((show) => {
    // console.log(shows);
    // console.log(show);
    return show.name.toLowerCase().includes(searchString);
  });
  if (e.target.value) {
    dispNum.innerHTML = `${filteredShows.length} Episode found`;
  } else {
    dispNum.innerHTML = `${shows.length} Episode exist`;
  }

  console.log(filteredShows);
  // let num = (dispNum.innerHTML = `${filteredShows.length} fonund`);
  // dispNum.innerHTML = `${shows.length} found`;

  // console.log(filteredShows);
  dispalayShows(filteredShows);
});
const loadShows = async () => {
  try {
    const res = await fetch("https://api.tvmaze.com/shows/527/episodes");
    shows = await res.json();
    dispNum.innerHTML = `${shows.length} Episode exist`;
    dispalayShows(shows);
    console.log(shows);
    selectCreate(shows);
  } catch (err) {
    console.error(err);
  }
};

function selectCreate(data) {
  const select = document.querySelector("select");

  const option0 = document.createElement("option");
  option0.innerText = "All episodes";
  option0.setAttribute("value", 0);
  select.append(option0);
  //episodes
  data.map((episode) => {
    const ccOption = document.createElement("option");
    ccOption.innerText = `S0${episode.season} E0${episode.number}  ${episode.name}`;
    ccOption.setAttribute("value", episode.id);
    select.append(ccOption);
  });

  select.options[0].selected = true;
  dispalayShows(data);

  select.addEventListener("change", () => {
    data.map((e) => {
      if (e.id == select.value) {
        dispalayShows([e]);
      }
      if (select.value == 0) {
        dispalayShows(data);
      }
    });
  });
}
const dispalayShows = (showsInfo) => {
  const htmlDisplay = showsInfo
    .map((showsInfo) => {
      return `
      <a href="${showsInfo.url}">
      <div class="movie card" href="${showsInfo.url}" >
      <img
      src="${showsInfo.image.medium}"
      alt="${showsInfo.name}"
      />
      <div class="flexES">
      <span class="seasonNum">S0${showsInfo.season}</span>
      <span class="episodeNum">E0${showsInfo.number}</span>
      </div>
      <div class="movie-info">
      <h3 class="h3">${showsInfo.name}</h1>
      <span class="${getColor(showsInfo.rating.average)}">${
        showsInfo.rating.average
      }</span>
      
      </div>
      
      <div class="overview">
      ${showsInfo.summary}
      </div>
      </div>
      </a>
      `;
    })
    .join("");
  main.innerHTML = htmlDisplay;
};
loadShows();
function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// selector style
document.querySelectorAll(".custom-select").forEach(setupSelector);

function setupSelector(selector) {
  selector.addEventListener("change", (e) => {
    console.log("changed", e.target.value);
  });

  selector.addEventListener("mousedown", (e) => {
    if (window.innerWidth >= 420) {
      // override look for non mobile
      e.preventDefault();

      const select = selector.children[0];
      const dropDown = document.createElement("ul");
      dropDown.className = "selector-options";

      [...select.children].forEach((option) => {
        const dropDownOption = document.createElement("li");
        dropDownOption.textContent = option.textContent;

        dropDownOption.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          select.value = option.value;
          selector.value = option.value;
          select.dispatchEvent(new Event("change"));
          selector.dispatchEvent(new Event("change"));
          dropDown.remove();
        });

        dropDown.appendChild(dropDownOption);
      });

      selector.appendChild(dropDown);

      // handle click out
      document.addEventListener("click", (e) => {
        if (!selector.contains(e.target)) {
          dropDown.remove();
        }
      });
    }
  });
}
