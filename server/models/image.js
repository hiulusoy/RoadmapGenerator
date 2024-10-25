module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    type: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.BLOB("long"),
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  // Image.sync({alter: true});
  
  return Image;
};
