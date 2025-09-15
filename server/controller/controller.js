let Drugdb = require('../model/model');


// creates and saves a new drug
exports.create = (req,res)=>{
    // validate incoming request
    if(!req.body){// if content of request (form data) is empty
        res.status(400).send({ message : "Content cannot be emtpy!"});// respond with this
        return;
    }

    //create new drug
    const drug = new Drugdb({
        name : req.body.name,//take values from form and assign to schema
        card : req.body.card,
        pack: req.body.pack,
        perDay : req.body.perDay,
        dosage : req.body.dosage
    })

    //save created drug to database
    drug
        .save(drug)//use the save operation on drug
        .then(data => {
            console.log(`${data.name} added to the database`) 
            res.redirect('/manage');
        })
        .catch(err =>{
            res.status(500).send({//catch error
                message : err.message || "There was an error while adding the drug"
            });
        });

}


// can either retrieve all drugs from the database or retrieve a single user
exports.find = (req,res)=>{

    if(req.query.id){//if we are searching for drug using its ID
        const id = req.query.id;

        Drugdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Can't find drug with id: "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Error retrieving drug with id: " + id})
            })

    }else{
        Drugdb.find()
            .then(drug => {
                res.send(drug)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "An error occurred while retriving drug information" })
            })
    }
}


// edits a drug selected using its  ID
exports.update = (req,res)=>{
    if(!req.body){
        return res.status(400).send({ message : "Cannot update with empty data"});
    }

    const id = req.params.id;

    Drugdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Drug with id: ${id} not found`});
            }else{
                console.log(`${data.name} updated successfully`);
                // Nếu gọi từ form -> redirect
                res.redirect('/manage');
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error updating drug information"});
        });
};


// deletes a drug using its drug ID
exports.delete = (req,res)=>{
    const id = req.params.id;
    Drugdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete drug with id: ${id}. Pls check id`})
            }else{
                res.send({
                    message : `${data.name} was deleted successfully!`
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Drug with id=" + id
            });
        });
}


// ... các hàm create, find, update, delete ở trên

// === PURCHASE ===
exports.purchase = async (req, res, next) => {
  try {
    const { id, quantity } = req.body; // id thuốc và số lượng muốn mua

    if (!id || !quantity) {
      return res.status(400).send({ message: "Drug id and quantity are required" });
    }

    const drug = await Drugdb.findById(id);
    if (!drug) {
      return res.status(404).send({ message: "Drug not found" });
    }

    // kiểm tra còn đủ thuốc không
    if (drug.pack < quantity) {
      return res.status(400).send({ message: "Not enough packs available" });
    }

    // trừ số lượng pack
    drug.pack -= quantity;
    await drug.save();

    console.log(`💊 Purchased ${quantity} pack(s) of ${drug.name}`);
    res.redirect('/manage'); // quay lại danh sách thuốc
  } catch (err) {
    next(err); // gửi lỗi cho error handler
  }
};
