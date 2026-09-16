import React from "react";

const StatsCard = ({ icon: Icon, number, title, tone = "orange" }) => {
  const toneToClass = {
    orange: "stats-icon-orange",
    blue: "stats-icon-blue",
    red: "stats-icon-red",
    green: "stats-icon-green"
  };

  return (
    <div className="stats-card-unified">
      <div className={`stats-icon-unified ${toneToClass[tone]}`}>
        {Icon && <Icon size={20} />}
      </div>

      <div>
        <h2>{number}</h2>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
