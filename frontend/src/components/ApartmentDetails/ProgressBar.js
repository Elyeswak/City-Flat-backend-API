const ProgressBar = (props) => {
  const { bgcolor, completed } = props;

  const containerStyles = {
    width: "100%",
    backgroundColor: "#d7d7d7",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
    height: 10,
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    textAlign: "right",
  };

  const labelStyles = {
    padding: 5,
    paddingLeft: 0,
    color: "#000",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
