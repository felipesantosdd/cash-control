import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useTransaction } from "../context/TransactionContext";
import YearArrowsSelector from "./YearArrowsSelector";

const ChartsPage = () => {
  const { transactions, categories, currentYear, fetchTransactions } =
    useTransaction();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const chartContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    categoria: "",
    valor: 0,
  });

  // Recarrega as transações quando o ano selecionado mudar
  useEffect(() => {
    fetchTransactions(selectedYear);
  }, [selectedYear, fetchTransactions]);

  useLayoutEffect(() => {
    if (chartContainerRef.current) {
      setContainerWidth(chartContainerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (chartContainerRef.current) {
        setContainerWidth(chartContainerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cores para as linhas do gráfico
  const lineColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85C1E9",
    "#D7BDE2",
  ];

  // Função para calcular dados dos gráficos
  const calculateChartData = () => {
    // Filtra transações do ano selecionado e pagas
    const yearTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.maturity);
      return date.getFullYear() === currentYear && transaction.pay === true;
    });

    // Dados por mês
    const monthlyData = Array.from({ length: 12 }, (_, month) => {
      const monthTransactions = yearTransactions.filter((transaction) => {
        const date = new Date(transaction.maturity);
        return date.getMonth() === month;
      });

      const totalIncome = monthTransactions
        .filter((t) => t.tipo === "entrada")
        .reduce((sum, t) => sum + parseFloat(t.valor), 0);

      const totalExpense = monthTransactions
        .filter((t) => t.tipo === "saida")
        .reduce((sum, t) => sum + parseFloat(t.valor), 0);

      return {
        month: month,
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense,
      };
    });

    // Dados por categoria
    const categoryData = categories.map((category) => {
      const categoryTransactions = yearTransactions.filter(
        (transaction) => transaction.category_id === category.id
      );

      const total = categoryTransactions.reduce((sum, t) => {
        const value = parseFloat(t.valor);
        return t.tipo === "entrada" ? sum + value : sum - value;
      }, 0);

      return {
        category: category.name,
        total: total,
      };
    });

    // Dados de despesas por categoria por mês
    const categoryMonthlyExpenses = categories
      .map((category) => {
        const monthlyExpenses = Array.from({ length: 12 }, (_, month) => {
          const monthCategoryTransactions = yearTransactions.filter(
            (transaction) => {
              const date = new Date(transaction.maturity);
              return (
                date.getMonth() === month &&
                transaction.category_id === category.id &&
                transaction.tipo === "saida" &&
                transaction.pay === true
              );
            }
          );

          return monthCategoryTransactions.reduce(
            (sum, t) => sum + parseFloat(t.valor),
            0
          );
        });

        return {
          category: category.name,
          monthlyExpenses: monthlyExpenses,
          totalExpense: monthlyExpenses.reduce(
            (sum, expense) => sum + expense,
            0
          ),
        };
      })
      .filter((data) => data.totalExpense > 0); // Remove categorias sem despesas

    return { monthlyData, categoryData, categoryMonthlyExpenses };
  };

  const { monthlyData, categoryData, categoryMonthlyExpenses } =
    calculateChartData();
  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  // Gera anos disponíveis (últimos 5 anos)
  const availableYears = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  // Função para renderizar o gráfico de linha
  const renderLineChart = () => {
    if (categoryMonthlyExpenses.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          Nenhuma despesa encontrada para o ano selecionado
        </div>
      );
    }

    const maxValue = Math.max(
      ...categoryMonthlyExpenses.flatMap((cat) => cat.monthlyExpenses)
    );

    const chartHeight = 500;
    const padding = 60;
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = chartHeight - padding * 2;

    const getX = (monthIndex) => {
      return padding + (monthIndex * availableWidth) / 11;
    };

    const getY = (value) => {
      return chartHeight - padding - (value / maxValue) * availableHeight;
    };

    return (
      <div className="w-full overflow-x-auto relative" ref={chartContainerRef}>
        {/* Tooltip customizado */}
        {tooltip.visible && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y - 40,
              background: "rgba(30,30,40,0.97)",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "8px",
              pointerEvents: "none",
              fontSize: 14,
              zIndex: 10,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px #0006",
              border: "1px solid #A0052B",
            }}
          >
            <div>
              <b>{tooltip.categoria}</b>
            </div>
            <div>
              {tooltip.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>
        )}
        <svg
          width="100%"
          height={chartHeight}
          className="mx-auto"
          viewBox={`0 0 ${containerWidth} ${chartHeight}`}
          preserveAspectRatio="none"
        >
          {/* Grade de fundo */}
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={`grid-${i}`}
              x1={getX(i)}
              y1={padding}
              x2={getX(i)}
              y2={chartHeight - padding}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Linhas horizontais da grade */}
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={`hgrid-${i}`}
              x1={padding}
              y1={padding + (i * availableHeight) / 4}
              x2={containerWidth - padding}
              y2={padding + (i * availableHeight) / 4}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Rótulos dos meses */}
          {monthNames.map((month, i) => (
            <text
              key={`label-${i}`}
              x={getX(i)}
              y={chartHeight - 20}
              textAnchor="middle"
              fill="#9CA3AF"
              fontSize="12"
            >
              {month}
            </text>
          ))}

          {/* Linhas das categorias */}
          {categoryMonthlyExpenses.map((category, categoryIndex) => {
            const color = lineColors[categoryIndex % lineColors.length];
            const points = category.monthlyExpenses
              .map((value, monthIndex) => `${getX(monthIndex)},${getY(value)}`)
              .join(" ");

            return (
              <g key={`category-${categoryIndex}`}>
                {/* Linha */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={color}
                  strokeWidth="4"
                  opacity="0.8"
                />
                {/* Pontos */}
                {category.monthlyExpenses.map((value, monthIndex) => (
                  <circle
                    key={`point-${categoryIndex}-${monthIndex}`}
                    cx={getX(monthIndex)}
                    cy={getY(value)}
                    r="6"
                    fill={color}
                    stroke="#1a1a2e"
                    strokeWidth="2"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      const svgRect =
                        e.target.ownerSVGElement.getBoundingClientRect();
                      setTooltip({
                        visible: true,
                        x: e.clientX - svgRect.left,
                        y: e.clientY - svgRect.top,
                        categoria: category.category,
                        valor: value,
                      });
                    }}
                    onMouseLeave={() =>
                      setTooltip({ ...tooltip, visible: false })
                    }
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Apenas quanto foi arrecadado no ano selecionado */}
      <div className="bg-[#1a1a2e] rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-3">
          Total Arrecadado em {selectedYear}
        </h3>
        <div className="bg-green-600 bg-opacity-20 rounded p-3">
          <p className="text-green-400 text-sm">Total Receitas</p>
          <p className="text-white text-xl font-bold">
            {monthlyData
              .reduce((sum, m) => sum + m.income, 0)
              .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
      </div>

      {/* Lista única de despesas por categoria no ano + Gráfico de Pizza */}
      <div className="rounded-lg p-4 flex flex-col md:flex-row gap-8 items-stretch">
        {/* Lista 50% */}
        <div className="bg-[#1a1a2e] w-full md:w-1/2 h-full min-h-[630px] rounded-lg p-4 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-3">
            Despesas por Categoria no Ano
          </h3>
          {categories.length === 0 ? (
            <div className="text-gray-400 text-sm">
              Nenhuma categoria encontrada
            </div>
          ) : (
            <ul className="space-y-2">
              {categories
                .map((category) => {
                  const total = transactions
                    .filter((t) => {
                      const date = new Date(t.maturity);
                      return (
                        date.getFullYear() === currentYear &&
                        t.tipo === "saida" &&
                        t.pay === true &&
                        t.category_id === category.id
                      );
                    })
                    .reduce((sum, t) => sum + parseFloat(t.valor), 0);
                  return {
                    categoria: category.name,
                    valor: total,
                  };
                })
                .filter((item) => item.valor > 0)
                .sort((a, b) => b.valor - a.valor)
                .map((item, idx) => (
                  <li
                    key={item.categoria}
                    className="flex justify-between text-white text-base"
                  >
                    <span>
                      {idx + 1}° - {item.categoria}
                    </span>
                    <span className="font-bold">
                      {item.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
        {/* Gráfico de Pizza 50% */}
        <div className="bg-[#1a1a2e] w-full md:w-1/2 flex flex-col items-center justify-center rounded-lg p-4 min-h-[520px]">
          <h3 className="text-lg font-medium text-white mb-3">
            Distribuição das Despesas e Receitas (%)
          </h3>
          <PieChartDespesasAno
            data={categories
              .map((category) => {
                const total = transactions
                  .filter((t) => {
                    const date = new Date(t.maturity);
                    return (
                      date.getFullYear() === currentYear &&
                      t.tipo === "saida" &&
                      t.pay === true &&
                      t.category_id === category.id
                    );
                  })
                  .reduce((sum, t) => sum + parseFloat(t.valor), 0);
                return {
                  categoria: category.name,
                  valor: total,
                };
              })
              .filter((item) => item.valor > 0)}
            colors={lineColors}
            // Passando a prop height para o componente PieChartDespesasAno
            height={1000}
          />
        </div>
      </div>

      {/* Gráfico de linha de despesas por categoria */}
      <div className="bg-[#1a1a2e] rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-3">
          Despesas por Categoria - {selectedYear}
        </h3>
        {renderLineChart()}

        {/* Legenda */}
        <div className="mt-4 flex flex-wrap gap-3">
          {categoryMonthlyExpenses.map((category, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded"
                style={{
                  backgroundColor: lineColors[index % lineColors.length],
                }}
              ></div>
              <span className="text-white text-xs">
                {category.category} —{" "}
                {category.totalExpense.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function PieChartDespesasAno({ data, colors }) {
  const [hoveredSector, setHoveredSector] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center">
        Sem dados para o gráfico
      </div>
    );
  }
  const total = data.reduce((sum, item) => sum + item.valor, 0);
  let startAngle = 0;
  const baseRadius = 90;
  const cx = 110;
  const cy = 110;
  // Gera os paths dos setores
  const sectors = data.map((item, idx) => {
    const value = item.valor;
    const angle = (value / total) * 360;
    const endAngle = startAngle + angle;
    // Se for o setor destacado, aumenta o raio
    const isHovered =
      hoveredSector && hoveredSector.categoria === item.categoria;
    const radius = isHovered ? baseRadius * 1.15 : baseRadius;
    // Conversão para coordenadas
    const largeArc = angle > 180 ? 1 : 0;
    const x1 = cx + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = cy + radius * Math.sin((Math.PI * startAngle) / 180);
    const x2 = cx + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = cy + radius * Math.sin((Math.PI * endAngle) / 180);
    const path = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
    const sector = {
      path,
      color: colors[idx % colors.length],
      categoria: item.categoria,
      percent: ((value / total) * 100).toFixed(1),
      value: item.valor,
      midAngle: startAngle + angle / 2,
      isHovered,
    };
    startAngle += angle;
    return sector;
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          width={520}
          height={520}
          viewBox="0 0 220 220"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredSector(null)}
        >
          {sectors.map((sector, idx) => (
            <path
              key={sector.categoria}
              d={sector.path}
              fill={sector.color}
              stroke="#23233a"
              strokeWidth={2}
              onMouseEnter={() => setHoveredSector(sector)}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
            />
          ))}
        </svg>
        {hoveredSector && (
          <div
            className="absolute bg-[#1a1a2e] border border-gray-600 rounded-lg p-3 text-white text-sm shadow-lg z-10"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y - 10,
              pointerEvents: "none",
            }}
          >
            <div className="font-bold">{hoveredSector.categoria}</div>
            <div>
              Valor:{" "}
              {hoveredSector.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div>Percentual: {hoveredSector.percent}%</div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {sectors.map((sector, idx) => (
          <div key={sector.categoria} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: sector.color }}
            ></div>
            <span className="text-white text-xs">
              {sector.categoria} ({sector.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChartsPage;
