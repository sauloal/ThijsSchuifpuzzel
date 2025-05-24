function get_cells() {
  // Get all cells in the table
  let cells = document.getElementsByClassName("cell");
  return cells;
}

function get_cell_info(cell) {
  // Get the position of the clicked cell
  let row_number = parseInt(cell.getAttribute("row"));
  let column_number = parseInt(cell.getAttribute("column"));
  let position = parseInt(cell.getAttribute("position"));
  let size = parseInt(cell.getAttribute("size"));
  let cell_type = cell.getAttribute("cell_type");
  let value = cell.getAttribute("value");
  let text = cell.innerHTML;

  // console.log(`Cell info: row ${row_number}, column ${column_number}, position ${position}, value ${value}, size ${size}, cell_type ${cell_type} text ${text}`);

  let is_empty = false;
  let is_match = false;
  if (isNaN(value)) {
    // console.log("Clicked cell is empty");
    is_empty = true;
  } else {
    value = parseInt(value);
    if (value === position) {
      is_match = true;
    }
  }

  return [row_number, column_number, position, value, size, cell_type, text, is_empty, is_match];
}

function is_ordered() {
  let cells = get_cells();
  console.log(`cells: ${cells.length} ${cells}`);

  for (let i = 0; i < cells.length-1; i++) {
    let cell = cells[i];

    let [row_number, column_number, position, value, size, cell_type, text, is_empty, is_match] = get_cell_info(cell);

    // If the value is not a number, skip it
    if (is_empty) {
      // console.log("Empty cell found, skipping...");
      return false;
    }

    if (!is_match) {
      // console.warn(`Cell at row ${row_number}, column ${column_number} with value ${value} is not in the correct position (expected ${position})`);
      return false;
    }
  }

  console.log("All cells are in the correct position");

  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    cell.removeEventListener("click", move_cell);
    cell.classList.add("finished");
  }

  return true;
}

function get_cell(row_number, column_number) {
  let cell = document.querySelectorAll(`[row='${row_number}'][column='${column_number}']`);
  return cell[0];
}

function get_neighboring_cells(cell) {
  let neighbours = [];

  let [row_number, column_number, position, value, size, cell_type, text, is_empty, is_match] = get_cell_info(cell);
  console.log(`Getting neighbours for cell at row ${row_number}, column ${column_number}`);

  if (row_number > 1) {
    // Has top neighbour
    // console.log('has top neighbour');
    let top_neighbour = get_cell(row_number - 1, column_number);
    neighbours.push(top_neighbour);
  }
  if (row_number < size) {
    // Has bottom neighbour
    // console.log('has bottom neighbour');
    let bottom_neighbour = get_cell(row_number + 1, column_number);
    neighbours.push(bottom_neighbour);
  }
  if (column_number > 1) {
    // Has left neighbour
    // console.log('has left neighbour');
    let left_neighbour = get_cell(row_number, column_number - 1);
    neighbours.push(left_neighbour);
  }
  if (column_number < size) {
    // Has right neighbour
    // console.log('has right neighbour');
    let right_neighbour = get_cell(row_number, column_number + 1);
    neighbours.push(right_neighbour);
  }

  console.log(`Neighbours found: ${neighbours.length} ${neighbours}`);

  return neighbours;
}

function move_cell(event) {
  // Get the clicked cell

  let cell = event.srcElement;
  console.log(event.target);
  console.log(`Cell clicked: ${cell}`);
  console.log(`Cell clicked: ${cell.getAttribute("row")}, ${cell.getAttribute("column")}, ${cell.getAttribute("position")}, ${cell.getAttribute("value")}, ${cell.getAttribute("size")}, ${cell.getAttribute("cell_type")}`);

  let [row_number, column_number, position, value, size, cell_type, text, is_empty, is_match] = get_cell_info(cell);
  console.log(`Move cell: row ${row_number}, column ${column_number}, position ${position}, value ${value}, size ${size}, cell_type ${cell_type}, is_empty ${is_empty}, is_match ${is_match}`);

  if (is_empty) {
    console.warn("Clicked cell is empty, nothing to move.");
    return;
  }

  let neighbours = get_neighboring_cells(cell);
  let found_empty_neighbour = false;
  console.log(`Found ${neighbours.length} neighbours ${neighbours}`);

  for (let neighbour of neighbours) {
    console.log(`Neighbour cell: ${neighbour}`);
    
    let [neighbour_row_number, neighbour_column_number, neighbour_position, neighbour_value, neighbour_size, neighbour_cell_type, neighbour_text, neighbour_is_empty, neighbour_is_match] = get_cell_info(neighbour);

    if (neighbour_is_empty) {
      console.log(`Found empty neighbour at row ${neighbour_row_number}, column ${neighbour_column_number}`);
      neighbour.setAttribute("value", value);
      neighbour.setAttribute("cell_type", cell_type);
      neighbour.innerHTML = text;
      cell.setAttribute("value", neighbour_value);
      cell.setAttribute("cell_type", neighbour_cell_type);
      cell.innerHTML = neighbour_text;
      found_empty_neighbour = true;
      console.log(`Moved cell from row ${row_number}, column ${column_number} to empty neighbour at row ${neighbour_row_number}, column ${neighbour_column_number}`);
    }
  }

  if (!found_empty_neighbour) {
    console.warn("No empty neighbour found, cannot move the cell.");
    return;
  }
  
  // Check if the table is ordered after the move
  if (is_ordered()) {
    console.log("The table is now ordered!");
  } else {
    console.warn("The table is not ordered yet.");
  }
}

function main(size) {
  console.log("Hello, World!");

  let content = document.getElementById("content");

  // console.log(content);

  // Create list of numbers for each cell
  let sorted_numbers = [];
  for (let number = 0; number < (size * size)-1; number++) {
    sorted_numbers.push(number+1);
  }
  console.log(`sorted numbers ${sorted_numbers}`);

  // Randomize list of numbers for the cell
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  // let ramdom_numbers = sorted_numbers;
  let ramdom_numbers = sorted_numbers.sort( () => .5 - Math.random() );
  console.log(`ramdom numbers ${ramdom_numbers}`);

  // Create table
  let table = document.createElement("table");

  // For each row
  for (let row_number = 0; row_number < size; row_number++) {

    // Create a HTML row
    let row = document.createElement("tr");
    row.setAttribute("row", row_number+1);

    // For each columns
    for (let column_number = 0; column_number < size; column_number++) {
      // Create a HTML cell
      let cell = document.createElement("td");
      cell.setAttribute("columna", column_number+1);

      // Get the value for the cell from the randomize list of values
      let value = ramdom_numbers[row_number * size + column_number];
      let cell_type = "number";

      // If no value (last cell), write "EMPTY"
      if (value === undefined) {
        value = "EMPTY";
        cell_type = "empty";
      }

      // Set value to cell
      cell.setAttribute("row", row_number+1);
      cell.setAttribute("column", column_number+1);
      cell.setAttribute("position", ((row_number * size) + column_number) + 1);
      cell.setAttribute("value", value);
      cell.setAttribute("size", size);
      cell.setAttribute("cell_type", cell_type);
      cell.classList.add("cell");
      // cell.classList.add(cell_type);
      cell.innerHTML = value;
      cell.addEventListener("click", move_cell);
      console.log(`row: ${row_number+1} column: ${column_number+1} value: ${value}`);

      // Add cell to row
      row.appendChild(cell);
    }

    // Add row to table
    table.appendChild(row);
  }

  // Add table to page
  content.appendChild(table);

  // Check if the table is ordered
  if (is_ordered()) {
    console.warn("The table is ordered. rebuilding it...");
    content.innerHTML = "";
    main(size);
  };
}

// Wait all the page elements to be loaded
document.addEventListener("DOMContentLoaded", function() {
  // Call the main funcion
  let size = 4;
  main(size);
});
