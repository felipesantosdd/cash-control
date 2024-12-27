import React, { useState } from "react";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { IconButton, Tooltip } from "@mui/material";

const MenuAnimado = ({
  onAddClick,
  onCloneClick,
  onDeleteClick,
  openExternal,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    {
      icon: <CloseIcon />,
      onClick: () => setShowMenu(false),
      legend: "Fechar menu de ações",
    },
    {
      icon: <MenuBookIcon />,
      onClick: () =>
        openExternal(
          "https://github.com/felipesantosdd/cash-control#cashcontrol"
        ),
      legend: "Abrir documentação no GitHub",
    },
    {
      icon: <DeleteIcon />,
      onClick: onDeleteClick,
      legend: "Excluir todas as transações de um mês",
    },
    {
      icon: <ContentCopyIcon />,
      onClick: onCloneClick,
      legend: "Duplicar transações para o outro mês",
    },
    {
      icon: <AddIcon />,
      onClick: onAddClick,
      legend: "Adicionar nova transação",
    },
  ];

  return (
    <div className="fixed bottom-0 right-10 p-4">
      <div>
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            transform origin-bottom
            ${showMenu ? "opacity-100 max-h-96" : "opacity-0 max-h-0"}
          `}
        >
          <div className="flex flex-col-reverse gap-2 mb-2">
            {menuItems.map((item, index) => (
              <Tooltip title={item.legend} placement="left">
                <Fab
                  key={index}
                  onClick={item.onClick}
                  style={{ backgroundColor: "#9F0049" }}
                >
                  {item.icon}
                </Fab>
              </Tooltip>
            ))}
          </div>
        </div>

        <Fab
          className={`transition-transform duration-300 ${
            !showMenu && "animate-bounce"
          }`}
          onClick={() => setShowMenu(true)}
          style={{
            backgroundColor: "#9F0049",
            display: showMenu ? "none" : "",
          }}
        >
          <MenuIcon />
        </Fab>
      </div>
    </div>
  );
};

export default MenuAnimado;
