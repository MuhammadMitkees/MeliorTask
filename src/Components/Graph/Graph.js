import React, { useEffect, useMemo } from "react";
import { MainDiv } from "./GraphStyle";
function Graph(props) {
  const graphData = useMemo(() => {
    const result = {};
    if (props.data) {
      props.data.map((item) => {
        result[item.second.startAndEndDateSec] =
          (item.second.sumOfAvgSec * 100) / item.second.sumOfEnteriesCountSec;
        result[item.fourth.startAndEndDateFourth] =
          (item.fourth.sumOfAvgFourth * 100) /
          item.fourth.sumOfEnteriesCountFourth;
      });
      return result;
    }
  }, [props.data]);

  useEffect(() => {
    var myCanvas = document.getElementById("myCanvas");
    myCanvas.width = 500;
    myCanvas.height = 500;

    var ctx = myCanvas.getContext("2d");

    function drawLine(ctx, startX, startY, endX, endY, color) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();
    }

    function drawBar(
      ctx,
      upperLeftCornerX,
      upperLeftCornerY,
      width,
      height,
      color
    ) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
      ctx.restore();
    }

    class BarChart {
      constructor(options) {
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;
        this.titleOptions = options.titleOptions;
        this.maxValue = 100;
      }

      drawGridLines() {
        var canvasActualHeight = this.canvas.height - this.options.padding * 2;
        var canvasActualWidth = this.canvas.width - this.options.padding * 2;

        var gridValue = 0;
        while (gridValue <= this.maxValue) {
          var gridY =
            canvasActualHeight * (1 - gridValue / this.maxValue) +
            this.options.padding;
          drawLine(
            this.ctx,
            0,
            gridY,
            this.canvas.width,
            gridY,
            this.options.gridColor
          );

          drawLine(
            this.ctx,
            15,
            this.options.padding / 2,
            15,
            gridY + this.options.padding / 2,
            this.options.gridColor
          );

          // Writing grid markers
          this.ctx.save();
          this.ctx.fillStyle = this.options.gridColor;
          this.ctx.textBaseline = "bottom";
          this.ctx.font = "bold 10px Arial";
          this.ctx.fillText(gridValue, 0, gridY - 2);
          this.ctx.restore();

          gridValue += this.options.gridStep;
        }
      }

      drawBars() {
        var canvasActualHeight = this.canvas.height - this.options.padding * 2;
        var canvasActualWidth = this.canvas.width - this.options.padding * 2;

        var barIndex = 0;
        // var numberOfBars = Object.keys(this.options.data).length;
        var barSize = 20;

        var values = Object.values(this.options.data);

        for (let val of values) {
          var barHeight = Math.round(
            (canvasActualHeight * val) / this.maxValue
          );

          drawBar(
            this.ctx,
            this.options.padding + barIndex * barSize,
            this.canvas.height - barHeight - this.options.padding,
            barSize,
            barHeight,
            this.colors[barIndex % this.colors.length]
          );

          barIndex++;
        }
      }

      drawLabel() {
        this.ctx.save();

        this.ctx.textBaseline = "bottom";
        this.ctx.textAlign = this.titleOptions.align;
        this.ctx.fillStyle = this.titleOptions.fill;
        this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`;

        let xPos = this.canvas.width / 2;

        if (this.titleOptions.align === "left") {
          xPos = 10;
        }
        if (this.titleOptions.align === "right") {
          xPos = this.canvas.width - 10;
        }

        this.ctx.fillText(this.options.seriesName, xPos, this.canvas.height);

        this.ctx.restore();
      }

      drawLegend() {
        let pIndex = 0;
        let legend = document.getElementById("canvasLegend");
        let ul = document.createElement("ul");
        ul.classList.add("flex");

        legend.append(ul);

        for (let ctg of Object.keys(this.options.data)) {
          let li = document.createElement("li");
          li.style.listStyle = "none";
          li.style.borderLeft =
            "20px solid " + this.colors[pIndex % this.colors.length];
          li.style.padding = "5px";
          li.textContent = ctg;
          ul.append(li);
          pIndex++;
        }
      }

      draw() {
        document.getElementById("myCanvas").innerHTML = "";
        document.getElementById("canvasLegend").innerHTML = "";
        this.drawGridLines();
        this.drawBars();
        this.drawLabel();
        this.drawLegend();
      }
    }

    var myBarchart = new BarChart({
      canvas: myCanvas,
      seriesName: "Medical Service - Reception, hospitality and admission",
      padding: 40,
      gridStep: 5,
      gridColor: "black",
      data: graphData,
      colors: [
        "#DCDCDC",
        "#FFF8DC",
        "#FFDEAD",
        "#DAA520",
        "#FF6347",
        "#FFD700",
        "#51e2f5",
        "#9df9ef",
        "#edf756",
        "#ffa8B6",
        "#a28089",
        "#e5eaf5",
        "#d0bdf4",
        "#8458B3",
        "#a28089",
        "#ff1d58",
        "#f75990",
        "#fff685",
        "#00DDFF",
        "#0049B7",
      ],
      titleOptions: {
        align: "center",
        fill: "black",
        font: {
          weight: "bold",
          size: "18px",
          family: "Lato",
        },
      },
    });

    myBarchart.draw();
  }, [graphData]);

  return (
    <MainDiv>
      <canvas id="myCanvas" style={{ background: "white" }}></canvas>
      <legend id="canvasLegend" htmlFor="myCanvas"></legend>
    </MainDiv>
  );
}

export default Graph;
