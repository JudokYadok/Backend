const { sequelize } = require('/home/t24123/models');

sequelize.sync({force: false})
    .then(()=>{
        cnosole.log("DB Connected Success");
    })
    .catch((err)=> {
        console.error(err);
    }
);