"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

//Static target date(replace with desired date)
const TARGET_DATE = new Date("2026-04-25T00:00:00");

//function to calculate the time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  // console.log(timeDifference)
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours:Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};
const DealCountDown = () => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    //calculate initial time on client
    setTime(calculateTimeRemaining(TARGET_DATE));

    const timeInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
      setTime(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timeInterval);
      }

      //this to clean up the useEffect to stop the time calculation
      return () => clearInterval(timeInterval);
    }, 1000);
  }, []);

  if (!time) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justcify-center">
          <h3 className="text-3xl font-bold">Loading Countdown...</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justcify-center">
        <h3 className="text-3xl font-bold">Deal of The Month</h3>
        <p>
          Geat ready for a shoppping experience like never before with our Deals
          of the Month! Every purchase comes wit exclusive parks and offers,
          making this month a celebration of savvy choices and amaizing deals.{" "}
          <br />
          Don&apos;t miss out! 🎁 🛒
        </p>
        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minuts" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild>
            <Link href="/search">View Menu</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          alt="promotion"
          src="/images/promo.jpg"
          width={300}
          height={200}
        />
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="p-4 w-full text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
);

export default DealCountDown;
