import userModel from "../models/user-model.js";
import { generateToken } from "../services/jwt-token.js";


export const createUser = async (req, res) => {
    try {
        const { userName, name, email, password, profileUrl, phoneNumber } = req.body;

        if (!userName, !name, !email, !password, !profileUrl, !phoneNumber) {
            return res.status(404).json({
                message: "Required Feild Missing",
                success: false,
                data: null
            })
        }

        const isExist = await userModel.findOne({ email: email });
        if (isExist) {
            return res.status(409).json({
                message: "Email already exist",
                success: false,
                data: null
            });
        }
        const newUser = new userModel({
            userName: userName,
            name: name,
            email: email,
            password: password,
            profileUrl: profileUrl,
            phoneNumber: phoneNumber,
        });
        const savedUser = await newUser.save();
        if (!savedUser) {
            return res.status(409).json({
                message: "Error while creating the User",
                success: fasle,
            });
        }


        return res.status(201).json({
            message: "New User Created Successfully",
            success: true,
            data: savedUser,
        });

    } catch (error) {
        throw error;
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(403).send("Please provide valid credentials");
        }
        const foundUser = await userModel.findOne({ email: email });

        if (!foundUser) {
            return res.status(403).json({
                message: "User does not exist",
                success: false,
                data: null
            });
        }
        if (password !== foundUser.password) {
            return res
                .status(406)
                .json({ message: "Password incorrect", success: false, data: null });
        }
        const userDetails = await userModel
            .findById({ _id: foundUser._id })
            .select("-password -__v");

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            data: {
                foundUer: userDetails,
                encodedToken: generateToken({ id: foundUser._id }),
            },
        });
    } catch (error) {
        throw error;
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword, !newPassword) {
            return res.status(401).json({
                success: false,
                message: 'required feils missing'
            })
        }

        const foundUer = await userModel.findById({ _id: id });
        if (!foundUer) {
            return res.status(500).json({ message: "No User Found", success: false });
        }
        if (currentPassword !== foundUer.password) {
            return res
                .status(409)
                .json({ message: "Current Password is Incorrect", success: false });
        }
        await userModel.findByIdAndUpdate(
            { _id: id },
            { $set: { password: newPassword } },
            { new: true }
        );
        return res.json({
            message: "Password updated successfully",
            success: true,
        });
    } catch (error) {
        throw error;
    }
};

export const updateProfilePicture = async (req, res) => {
    try {

        const { id } = req.user

        if (!id) {
            return res.json({
                success: false,
                message: `your are not logged in so you cant update profile picture`
            })
        }

        const { newProfilePictureUrl } = req.body;

        if (!newProfilePictureUrl) {
            return res.status(404).json({
                success: false,
                message: `missing required feild`
            })
        }

        const foundUser = await userModel.findById({ _id: id });

        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "user not Found"
            })
        }

        const result = await userModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                profileUrl: newProfilePictureUrl
            }
        }, { new: true })

        if (!result || result.length < 1) {
            return res.status(204).json({
                success: false,
                message: `Profile picture is not updated`
            })
        }

        return res.status(201).json({
            success: true,
            message: `profile picture updated successfully`,
            data: result
        })



    } catch (error) {
        return res.status(500).json({
            message: `error : ${error.message}`,
            success: false,
        });
    }
}

export const updateContactDetails = async (req, res) => {
    try {

        const {id} = req.user

        if(!id) {
            return res.status(401).json({
                success: false,
                message: `Your not authorized to update any details`
            })
        }

        const {phoneNumber , address} = req.body


        if(!phoneNumber || !address) {
            return res.status(404).json({
                success: false,
                message: `required feilds missing`,
            })
        }

        const foundUser = await userModel.findById({_id : id});

        if(!foundUser) {
            return res.status(404).json({
                success : false,
                message : `user not found`
            })
        }


        const result = await userModel.findByIdAndUpdate({_id : id} , {
            $set : {
                phoneNumber : +phoneNumber,
                address : address
            }
        },{new : true});


        if(!result || result.length > 1) {
            return res.status(203).json({
                success : false,
                message : `user contact details is not updated`
            })
        }

        return res.status(201).json({
            success : true,
            message : `user contact details is succssfully updated`,
            data : result
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `error : ${error.message}`
        })
    }
}

export const findUserByPhoneNumber = async ( req , res) => {
    try {

        const {phoneNumber} = req.params


        if(!phoneNumber) {
            return res.status(404).json({
                success: false,
                message: `required feilds missing`,
            })
        }

        const foundUser = await userModel.find({phoneNumber : Number(phoneNumber)});



        if(!foundUser || foundUser.length < 1) {
            return res.status(404).json({
                success : false,
                message : `user not found`
            })
        }


        return res.status(200).json({
            success : true,
            message : `user found with number ${phoneNumber}`,
            data : foundUser
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `error : ${error.message}`
        })
    }
}