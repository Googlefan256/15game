import { useEffect, useState } from "preact/hooks";

function isPossible(grid: (number | null)[]) {
    let can = true;
    if ([1, 3, 4, 6, 9, 11, 12, 14].includes(grid.findIndex((v) => v === 16)))
        can = false;
    for (let i = 0; i < 16; i++) {
        let num = grid.indexOf(i + 1);
        if (num === i + 1) continue;
        grid[num] = grid[i];
        grid[i] = i + 1;
        can = !can;
    }
    return can;
}

function randomizedDefault() {
    const grid = Array.from({ length: 16 }).map((_, i) => i + 1);
    const shuffled = grid.sort(() => Math.random() - 0.5);
    if (!isPossible([...shuffled])) {
        const one = shuffled.indexOf(1);
        const two = shuffled.indexOf(2);
        const temp = shuffled[one];
        shuffled[one] = shuffled[two];
        shuffled[two] = temp;
    }
    return shuffled.map((v) => {
        if (v === 16) return null;
        return v;
    });
}

export function App() {
    const [grid, setGrid] = useState(randomizedDefault());
    const [startTime, setStartTime] = useState(Date.now());
    useEffect(() => {
        const isComplete = grid.every((v, i) => {
            if (v === null) return i === 15;
            return v === i + 1;
        });
        if (isComplete) {
            alert(
                `You won! It took you ${Math.floor(
                    (Date.now() - startTime) / 1000,
                )} seconds!`,
            );
            setGrid(randomizedDefault());
            setStartTime(Date.now());
        }
    }, [grid]);
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <div class="grid grid-rows-4 grid-cols-4 gap-4">
                    {grid.map((k, i) => (
                        <Card
                            key={i}
                            visible={k !== null}
                            onClick={() => {
                                const index = grid.findIndex((v) => v === k);
                                const nullIndex = grid.findIndex(
                                    (v) => v === null,
                                );
                                if (
                                    index === nullIndex - 1 ||
                                    index === nullIndex + 1 ||
                                    index === nullIndex - 4 ||
                                    index === nullIndex + 4
                                ) {
                                    const newGrid = [...grid];
                                    newGrid[index] = null;
                                    newGrid[nullIndex] = k;
                                    setGrid(newGrid);
                                }
                            }}
                        >
                            {k}
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

function Card({
    children,
    visible,
    onClick,
}: { children: number | null; visible: boolean; onClick?: () => void }) {
    return (
        <>
            <div
                class={`w-[150px] h-[150px] mx-auto ${
                    visible
                        ? "rounded-md shadow-md overflow-hidden bg-gray-500"
                        : "bg-white"
                } flex justify-center items-center`}
                onClick={onClick}
            >
                {visible && <p class="text-6xl text-white">{children}</p>}
            </div>
        </>
    );
}
