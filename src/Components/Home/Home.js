import React, { useEffect, useState } from "react";
import CalendarPicker from "../CalendarPicker";
import Graph from "../Graph/Graph";
import axios from "axios";
import { MainContainer, CalendarAndLabel } from "./HomeStyles";
import { Button, CircularProgress } from "@mui/material";

function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [review, setReview] = useState({});
  const [questions, setQuestions] = useState({});
  const [secondQues, setSecondQues] = useState({});
  const [secondQuesData, setSecondQuesData] = useState({});
  const [fourthQues, setFourthQues] = useState({});
  const [fourthQuesData, setFourthQuesData] = useState({});
  const [pointsCount, setPointsCount] = useState(0);
  const [lastpointCount, setLastPointCount] = useState(0);
  const [bulkPointsCount, setBulkPointsCount] = useState(0);
  let [pointsArr, setPointsArr] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [btnPrrsd, setBtnPrrsd] = useState(false);
  const quesUrl = "https://staging.mymelior.com/v1/questions";
  const reviewsUrl = `https://staging.mymelior.com/v1/branches/1/progress?date_from=${startDate}&date_to=${endDate}`;
  const requestsHeader = {
    headers: {
      Authorization: "Bearer SLSmxK17vjRInEWIiFQjwE1QIDfeSM",
    },
  };
  const largScreenTenthPointCount = (data) => {
    if (data?.length >= 10) {
      setPointsCount(10);
      if (data.length % 10 === 0) {
        setLastPointCount(data.length / 10);
        setBulkPointsCount(data.length / 10);
      } else {
        let modulasRound = 0;
        modulasRound = Math.ceil(data.length / 10);
        setBulkPointsCount(modulasRound);
        if (modulasRound * 9 !== data.length) {
          setLastPointCount(data.length - modulasRound * 9);
        }
      }
    } else {
      setPointsCount(data?.length);
    }
  };
  const mediumScreenTenthPointCount = (data) => {
    if (data.length >= 6) {
      setPointsCount(6);
      if (data.length % 6 === 0) {
        setLastPointCount(data / 6);
        setBulkPointsCount(data / 6);
      } else {
        let modulasRound = 0;
        modulasRound = Math.ceil(data.length % 6);
        setBulkPointsCount(modulasRound);
        if (modulasRound * 5 !== data.length) {
          setLastPointCount(data.length - modulasRound * 5);
        }
      }
    } else {
      setPointsCount(data.length);
    }
  };
  const smallScreenTenthPointCount = (data) => {
    if (data.length >= 4) {
      setPointsCount(4);
      if (data.length % 4 === 0) {
        setLastPointCount(data / 4);
        setBulkPointsCount(data / 4);
      } else {
        let modulasRound = 0;
        modulasRound = Math.ceil(data.length % 4);
        setBulkPointsCount(modulasRound);
        if (modulasRound * 3 !== data.length) {
          setLastPointCount(data.length - modulasRound * 3);
        }
      }
    } else {
      setPointsCount(data.length);
    }
  };
  useEffect(() => {
    pointsDays();
  }, [secondQuesData, fourthQuesData, window.innerWidth]);
  useEffect(() => {}, [pointsArr]);
  const pointsDays = () => {
    for (let i = 0; i < pointsCount; i++) {
      let sumOfAvgSec = 0;
      let sumOfEnteriesCountSec = 0;
      let startAndEndDateSec = "";
      let numberOfDaysSec = 0;
      let sumOfAvgFourth = 0;
      let sumOfEnteriesCountFourth = 0;
      let startAndEndDateFourth = "";
      let numberOfDaysFourth = 0;
      secondQuesData
        .slice(i * bulkPointsCount + 1, (i + 1) * bulkPointsCount)
        ?.map((item, index, arr) => {
          sumOfAvgSec = sumOfAvgSec + item.avg * item.entries_count;
          sumOfEnteriesCountSec = sumOfEnteriesCountSec + item.entries_count;
          if (index === 0 || index === arr.length - 1) {
            startAndEndDateSec =
              startAndEndDateSec + `${item.review__submitted_at__date} - `;
          }
          numberOfDaysSec = arr.length;
        });
      fourthQuesData
        .slice(i * bulkPointsCount, (i + 1) * bulkPointsCount + 1)
        ?.map((item, index, arr) => {
          sumOfAvgFourth = sumOfAvgFourth + item.avg * item.entries_count;
          sumOfEnteriesCountFourth =
            sumOfEnteriesCountFourth + item.entries_count;
          if (index === 0 || index === arr.length - 1) {
            startAndEndDateFourth =
              startAndEndDateFourth + `${item.review__submitted_at__date} - `;
          }
          numberOfDaysFourth = arr.length;
        });
      setPointsArr((prevArr) => [
        ...prevArr,
        {
          second: {
            sumOfAvgSec: sumOfAvgSec,
            sumOfEnteriesCountSec: sumOfEnteriesCountSec,
            startAndEndDateSec: startAndEndDateSec,
            numberOfDaysSec: numberOfDaysSec,
          },
          fourth: {
            sumOfAvgFourth: sumOfAvgFourth,
            sumOfEnteriesCountFourth: sumOfEnteriesCountFourth,
            startAndEndDateFourth: startAndEndDateFourth,
            numberOfDaysFourth: numberOfDaysFourth,
          },
        },
      ]);
    }
  };
  const quesReq = () => {
    axios
      .get(quesUrl, requestsHeader)
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {});
  };
  const renderResponsiveGraph = () => {
    const data = JSON.parse(localStorage.getItem("data"));

    if (window.innerWidth < 768) {
      smallScreenTenthPointCount(
        data.questions[1].representations[0].data.points
      );
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      mediumScreenTenthPointCount(
        data.questions[1].representations[0].data.points
      );
    } else {
      largScreenTenthPointCount(
        data.questions[1].representations[0].data.points
      );
    }
  };
  // window.addEventListener("resize", () => {
  //   reviewReq();
  // });

  const reviewReq = () => {
    setIsLoading(true);
    setBtnPrrsd(true);
    setPointsArr([]);
    if (startDate && endDate) {
      axios
        .get(reviewsUrl, requestsHeader)
        .then((res) => {
          setReview(res.data);
          setSecondQuesData(
            res.data.questions[1].representations[0].data.points
          );
          setFourthQuesData(
            res.data.questions[3].representations[0].data.points
          );
          localStorage.setItem("data", JSON.stringify(res.data));
          renderResponsiveGraph();
          setIsLoading(false);
        })
        .catch((err) => {});
    }
  };
  const buttonpressed = () => {
    setBtnPrrsd(true);
  };
  useEffect(() => {
    quesReq();
  }, []);
  return (
    <MainContainer>
      <CalendarAndLabel>
        <p>pick start date: </p>
        <CalendarPicker handleCallback={setStartDate} value={startDate} />
      </CalendarAndLabel>
      <CalendarAndLabel>
        <p>pick end date: </p>
        <CalendarPicker handleCallback={setEndDate} value={endDate} />
      </CalendarAndLabel>
      <Button onClick={reviewReq} variant="contained">
        Load graph
      </Button>

      {btnPrrsd &&
        (!isLoading ? (
          <Graph data={pointsArr} />
        ) : (
          <CircularProgress className="loader" />
        ))}
    </MainContainer>
  );
}

export default Home;
