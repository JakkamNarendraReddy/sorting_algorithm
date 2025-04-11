const arrayContainer = document.getElementById("arrayContainer");
const generateArrayBtn = document.getElementById("generateArray");
const startSortBtn = document.getElementById("startSort");
const stopSortBtn = document.getElementById("stopSort");
const algorithmSelect = document.getElementById("algorithm");
const speedSlider = document.getElementById("speed");

let array = [];
let speed = 100;
let sorting = false;

const algorithmDetails = {
    bubbleSort: {
        name: "Bubble Sort",
        timeComplexity: "Best: O(n), Worst: O(n^2), Average: O(n^2)",
        spaceComplexity: "O(1)"
    },
    selectionSort: {
        name: "Selection Sort",
        timeComplexity: "Best: O(n^2), Worst: O(n^2), Average: O(n^2)",
        spaceComplexity: "O(1)"
    },
    insertionSort: {
        name: "Insertion Sort",
        timeComplexity: "Best: O(n), Worst: O(n^2), Average: O(n^2)",
        spaceComplexity: "O(1)"
    },
    mergeSort: {
        name: "Merge Sort",
        timeComplexity: "Best: O(n log n), Worst: O(n log n), Average: O(n log n)",
        spaceComplexity: "O(n)"
    },
    quickSort: {
        name: "Quick Sort",
        timeComplexity: "Best: O(n log n), Worst: O(n^2), Average: O(n log n)",
        spaceComplexity: "O(log n)"
    }
};

function generateArray(size = 20) {
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    renderArray();
}

function renderArray() {
    arrayContainer.innerHTML = "";
    array.forEach((value) => {
        const bar = document.createElement("div");
        bar.className = "array-bar";
        bar.style.height = `${value * 3}px`;
        bar.style.width = `${100 / array.length}%`;
        arrayContainer.appendChild(bar);
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function bubbleSort() {
    const bars = document.querySelectorAll(".array-bar");
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (!sorting) return; // Stop sorting if user clicks stop button
            bars[j].classList.add("compare");
            bars[j + 1].classList.add("compare");

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                renderArray();
            }

            await sleep(speed);
            bars[j].classList.remove("compare");
            bars[j + 1].classList.remove("compare");
        }
        bars[array.length - i - 1].classList.add("active");
    }
    // Mark all bars as sorted
    document.querySelectorAll(".array-bar").forEach(bar => bar.classList.add("sorted"));
}

async function selectionSort() {
    const bars = document.querySelectorAll(".array-bar");
    for (let i = 0; i < array.length - 1; i++) {
        if (!sorting) return;
        let minIdx = i;
        bars[i].classList.add("compare");

        for (let j = i + 1; j < array.length; j++) {
            bars[j].classList.add("compare");

            if (array[j] < array[minIdx]) {
                minIdx = j;
            }

            await sleep(speed);
            bars[j].classList.remove("compare");
        }

        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            renderArray();
        }

        bars[i].classList.remove("compare");
        bars[i].classList.add("active");
    }
    // Mark all bars as sorted
    document.querySelectorAll(".array-bar").forEach(bar => bar.classList.add("sorted"));
}

async function insertionSort() {
    const bars = document.querySelectorAll(".array-bar");
    for (let i = 1; i < array.length; i++) {
        if (!sorting) return;
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            bars[j].classList.add("compare");
            array[j + 1] = array[j];
            renderArray();
            await sleep(speed);
            bars[j].classList.remove("compare");
            j--;
        }
        array[j + 1] = key;
        renderArray();
    }
    // Mark all bars as sorted
    document.querySelectorAll(".array-bar").forEach(bar => bar.classList.add("sorted"));
}

async function mergeSort(left = 0, right = array.length - 1) {
    if (left >= right || !sorting) return;

    const mid = Math.floor((left + right) / 2);

    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);

    // Mark all bars as sorted after merge
    if (left === 0 && right === array.length - 1) {
        document.querySelectorAll(".array-bar").forEach(bar => bar.classList.add("sorted"));
    }
}

async function merge(left, mid, right) {
    const bars = document.querySelectorAll(".array-bar");

    const leftArray = array.slice(left, mid + 1);
    const rightArray = array.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < leftArray.length && j < rightArray.length) {
        if (!sorting) return;

        bars[k].classList.add("compare");

        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }

        renderArray();
        await sleep(speed);
        bars[k].classList.remove("compare");
        k++;
    }

    while (i < leftArray.length) {
        if (!sorting) return;

        bars[k].classList.add("compare");
        array[k] = leftArray[i];
        i++;
        k++;

        renderArray();
        await sleep(speed);
        bars[k - 1].classList.remove("compare");
    }

    while (j < rightArray.length) {
        if (!sorting) return;

        bars[k].classList.add("compare");
        array[k] = rightArray[j];
        j++;
        k++;

        renderArray();
        await sleep(speed);
        bars[k - 1].classList.remove("compare");
    }
}

async function quickSort(low = 0, high = array.length - 1) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
    // Mark all bars as sorted after quickSort completes
    if (low === 0 && high === array.length - 1) {
        document.querySelectorAll(".array-bar").forEach(bar => bar.classList.add("sorted"));
    }
}

async function partition(low, high) {
    const bars = document.querySelectorAll(".array-bar");
    let pivot = array[high];
    let i = low - 1;
    bars[high].classList.add("compare");
    for (let j = low; j < high; j++) {
        if (!sorting) return;
        bars[j].classList.add("compare");
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            renderArray();
            await sleep(speed);
        }
        bars[j].classList.remove("compare");
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    renderArray();
    return i + 1;
}

startSortBtn.addEventListener("click", () => {
    if (!sorting) {
        const algorithm = algorithmSelect.value;
        sorting = true; // Start sorting

        // Run selected algorithm
        if (algorithm === "bubbleSort") bubbleSort();
        else if (algorithm === "selectionSort") selectionSort();
        else if (algorithm === "insertionSort") insertionSort();
        else if (algorithm === "quickSort") quickSort();
        else if (algorithm === "mergeSort") mergeSort();
    }
});

stopSortBtn.addEventListener("click", () => {
    sorting = false; // Stop sorting
});

generateArrayBtn.addEventListener("click", () => {
    sorting = false; // Reset sorting flag
    generateArray(); // Generate new array
});

speedSlider.addEventListener("input", (e) => {
    speed = 200 - e.target.value; // Adjust sorting speed
});

algorithmSelect.addEventListener("change", (e) => {
    const selectedAlgorithm = e.target.value;
    document.getElementById("algoName").textContent = algorithmDetails[selectedAlgorithm].name;
    document.getElementById("timeComplexity").textContent = algorithmDetails[selectedAlgorithm].timeComplexity;
    document.getElementById("spaceComplexity").textContent = algorithmDetails[selectedAlgorithm].spaceComplexity;

    sorting = false; // Reset sorting flag when algorithm changes
    generateArray(); // Generate new array when algorithm is changed
});

window.onload = () => generateArray();
