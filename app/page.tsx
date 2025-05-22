"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, RefreshCw, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function NQueensPage() {
  const [boardSize, setBoardSize] = useState(8)
  const [solutions, setSolutions] = useState<number[][]>([])
  const [currentSolution, setCurrentSolution] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    solveNQueens(boardSize)
  }, [boardSize])

  const solveNQueens = (n: number) => {
    setIsLoading(true)

    // Use setTimeout to prevent UI freezing for larger board sizes
    setTimeout(() => {
      const solutions: number[][] = []
      const backtrack = (row: number, cols: number[]) => {
        if (row === n) {
          solutions.push([...cols])
          return
        }

        for (let col = 0; col < n; col++) {
          if (isValid(cols, row, col)) {
            cols[row] = col
            backtrack(row + 1, cols)
          }
        }
      }

      const isValid = (cols: number[], row: number, col: number) => {
        for (let i = 0; i < row; i++) {
          // Check if queens are in the same column or diagonal
          if (cols[i] === col || cols[i] - i === col - row || cols[i] + i === col + row) {
            return false
          }
        }
        return true
      }

      backtrack(0, Array(n).fill(-1))
      setSolutions(solutions)
      setCurrentSolution(0)
      setIsLoading(false)
    }, 0)
  }

  const handleSizeChange = (value: number[]) => {
    setBoardSize(value[0])
  }

  const handlePrevSolution = () => {
    setCurrentSolution((prev) => (prev > 0 ? prev - 1 : solutions.length - 1))
  }

  const handleNextSolution = () => {
    setCurrentSolution((prev) => (prev < solutions.length - 1 ? prev + 1 : 0))
  }

  const renderBoard = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[400px] w-full">
          <RefreshCw className="animate-spin h-8 w-8 text-primary" />
        </div>
      )
    }

    if (solutions.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px] w-full">
          <p className="text-muted-foreground">No solutions found</p>
        </div>
      )
    }

    const currentQueens = solutions[currentSolution]
    const cellSize = Math.min(400 / boardSize, 50)

    return (
      <div
        className="grid mx-auto border border-border"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: boardSize }).map((_, row) =>
          Array.from({ length: boardSize }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              className={`flex items-center justify-center ${(row + col) % 2 === 0 ? "bg-white" : "bg-gray-200"}`}
              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            >
              {currentQueens[row] === col && <Crown className="text-yellow-500 h-4/5 w-4/5" />}
            </div>
          )),
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">N-Queens Problem</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Chessboard</CardTitle>
            <CardDescription>
              Place {boardSize} queens on a {boardSize}×{boardSize} chessboard so that no two queens threaten each other
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">{renderBoard()}</CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevSolution} disabled={solutions.length <= 1}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <div className="text-center">
              {solutions.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  Solution {currentSolution + 1} of {solutions.length}
                </span>
              )}
            </div>
            <Button variant="outline" onClick={handleNextSolution} disabled={solutions.length <= 1}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Adjust the board size and explore different solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Board Size (N)</span>
                <span className="font-medium">{boardSize}</span>
              </div>
              <Slider value={[boardSize]} min={4} max={12} step={1} onValueChange={handleSizeChange} />
              <div className="text-xs text-muted-foreground">Note: Larger board sizes may take longer to compute</div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Statistics</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total Solutions:</div>
                <div>{isLoading ? "Calculating..." : solutions.length}</div>
                <div>First Solution:</div>
                <div>{solutions.length > 0 ? solutions[0].map((col) => col + 1).join(", ") : "None"}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => solveNQueens(boardSize)} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Solving...
                </>
              ) : (
                "Solve Again"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About the N-Queens Problem</h2>
        <p className="mb-4">
          The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard so that no two queens
          threaten each other. Thus, a solution requires that no two queens share the same row, column, or diagonal.
        </p>
        <p>
          The problem has 92 distinct solutions for an 8×8 board. If solutions that differ only by symmetry operations
          (rotations and reflections) are counted as one, the problem has 12 unique solutions.
        </p>
      </div>
    </div>
  )
}
