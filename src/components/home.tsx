/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/a5T6PcdO6cS
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

// Define the Habit type
type Habit = {
  id: string;
  name: string;
  emoji: string;
  currentValue: number;
  dailyGoal: number;
  unit: string;
  increment: number;
};

export function HabitsList() {
  // Load habits from localStorage on component mount
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits, isClient]);

  // Function to update habit value
  const updateHabitValue = (id: string, increment: boolean) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              currentValue: Math.max(
                0,
                habit.currentValue +
                  (increment ? habit.increment : -habit.increment)
              ),
            }
          : habit
      )
    );
  };

  const [newHabit, setNewHabit] = useState<Omit<Habit, "id">>({
    name: "",
    emoji: "💧",
    currentValue: 0,
    dailyGoal: 100,
    unit: "units",
    increment: 10,
  });

  const [isLoadingEmoji, setIsLoadingEmoji] = useState(false);

  const autoPickEmoji = async () => {
    setIsLoadingEmoji(true);
    try {
      const response = await fetch(
        "https://llama3.gaianet.network/v1/chat/completions",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Pick the most relevant emoji from all emojis for - ${newHabit.name}. Make sure it's the closest and most relevant option. The emoji is for a habit tracker app and the emoji would be asked for a habit user wants to track. Pick the emoji for the verb in the habit name and then a noun in that order. Just return the emoji nothing else.`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setNewHabit((prev) => ({
          ...prev,
          emoji: data.choices[0].message.content,
        }));
      }
    } catch (error) {
      console.error("Error fetching emoji:", error);
    } finally {
      setIsLoadingEmoji(false);
    }
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const habit: Habit = {
      ...newHabit,
      id: Date.now().toString(),
    };
    setHabits([...habits, habit]);
    setNewHabit({
      name: "",
      emoji: "💧",
      currentValue: 0,
      dailyGoal: 100,
      unit: "units",
      increment: 10,
    });
  };

  // Add a state for the inspirational quote
  const [quote, setQuote] = useState(
    "The secret of getting ahead is getting started."
  );

  // You could potentially fetch a random quote from an API here
  useEffect(() => {
    // For now, we'll just use a static quote
    // But you could replace this with an API call to get a random quote
    setQuote("The secret of getting ahead is getting started.");
  }, []);

  const deleteHabit = (id: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      setHabits(habits.filter((habit) => habit.id !== id));
    }
  };

  const resetAllHabits = () => {
    if (
      window.confirm("Are you sure you want to reset all habit counters to 0?")
    ) {
      // Store current habits data with timestamp
      const timestamp = Math.floor(Date.now() / 1000); // Unix epoch time in seconds
      const currentData = JSON.stringify(habits);
      localStorage.setItem(`habits_backup_${timestamp}`, currentData);

      // Reset all habit counters
      setHabits(
        habits.map((habit) => ({
          ...habit,
          currentValue: 0,
        }))
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-1 sm:py-2 bg-white">
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#4a4a4a] dark:text-[#f0f0f0] flex items-center justify-center">
          <span className="mr-2">🌟</span> Habits
        </h1>
        <p className="text-xs sm:text-sm text-[#7a7a7a] dark:text-[#b0b0b0] mt-1 sm:mt-2 italic">
          &quot;{quote}&quot;
        </p>
      </div>

      <div className="flex justify-center mb-4">
        <Button
          onClick={resetAllHabits}
          variant="outline"
          size="sm"
          className="text-red-500 border-red-500 hover:bg-red-100"
        >
          Reset All Counters
        </Button>
      </div>

      <div className="grid gap-4 mb-8">
        {habits.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">No habits added yet.</p>
            <p className="text-sm mt-2">Add a new habit to get started!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <Card
              key={habit.id}
              className="p-3 sm:p-4 bg-[#fff] dark:bg-[#2a2a2a] shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{habit.emoji}</span>
                  <h3 className="text-base sm:text-lg font-medium text-[#4a4a4a] dark:text-[#f0f0f0]">
                    {habit.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateHabitValue(habit.id, false)}
                  >
                    <MinusIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a4a4a] dark:text-[#f0f0f0]" />
                  </Button>
                  <span className="text-xl sm:text-2xl font-bold text-[#4a4a4a] dark:text-[#f0f0f0] min-w-[3ch] text-center">
                    {habit.currentValue}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateHabitValue(habit.id, true)}
                  >
                    <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a4a4a] dark:text-[#f0f0f0]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHabit(habit.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-[#7a7a7a] dark:text-[#b0b0b0] mt-2">
                <span>
                  Daily Goal: <span className="mr-1">{habit.dailyGoal}</span>
                  {habit.unit}
                </span>
                <span>
                  Current: <span className="mr-1">{habit.currentValue}</span>
                  {habit.unit}
                </span>
              </div>
              <div className="w-full bg-[#f0f0f0] dark:bg-[#3a3a3a] rounded-full mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (habit.currentValue / habit.dailyGoal) * 100,
                      100
                    )}%`,
                    backgroundColor: getPastelColor(habit.name),
                  }}
                />
              </div>
            </Card>
          ))
        )}
      </div>

      <hr className="my-8" />

      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#4a4a4a] dark:text-[#f0f0f0] flex items-center">
          <span className="mr-2">➕</span> Add New Habit
        </h2>
      </div>

      <form onSubmit={addHabit} className="space-y-3 sm:space-y-4">
        <Input
          placeholder="Habit name"
          value={newHabit.name}
          onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
          required
          className="text-sm sm:text-base"
        />
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Emoji"
            value={newHabit.emoji}
            onChange={(e) =>
              setNewHabit({ ...newHabit, emoji: e.target.value })
            }
            required
            className="text-sm sm:text-base flex-grow"
          />
          <Button
            type="button"
            onClick={autoPickEmoji}
            disabled={isLoadingEmoji}
            className="whitespace-nowrap text-xs sm:text-sm bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-semibold transition-all duration-200"
          >
            {isLoadingEmoji ? "Loading..." : "Auto Pick Emoji"}
          </Button>
        </div>
        <Input
          type="number"
          placeholder="Daily goal"
          value={newHabit.dailyGoal}
          onChange={(e) =>
            setNewHabit({ ...newHabit, dailyGoal: parseInt(e.target.value) })
          }
          required
          className="text-sm sm:text-base"
        />
        <Input
          placeholder="Unit"
          value={newHabit.unit}
          onChange={(e) => setNewHabit({ ...newHabit, unit: e.target.value })}
          required
          className="text-sm sm:text-base"
        />
        <Input
          type="number"
          placeholder="Increment"
          value={newHabit.increment}
          onChange={(e) =>
            setNewHabit({ ...newHabit, increment: parseInt(e.target.value) })
          }
          required
          className="text-sm sm:text-base"
        />
        <Button type="submit" className="w-full text-sm sm:text-base">
          Add Habit
        </Button>
      </form>
    </div>
  );
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

function getPastelColor(habitName: string): string {
  const hash = hashString(habitName);
  const hue = hash % 360;
  const saturation = 70 + (hash % 20); // 70-90%
  const lightness = 80 + (hash % 10); // 80-90%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
