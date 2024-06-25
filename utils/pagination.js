'use strict';
// Allow my pagination to use a default filter function if none is provided. This way, it won’t throw an error when the filter function is omitted. 
const paginatedResults = (model, getFilter = () => ({})) => {
    return async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 6;

            // Use the getFilter function to get the filter object dynamically
            const filter = getFilter(req);

            const totalItems = await model.countDocuments(filter);
            const totalPages = Math.ceil(totalItems / perPage);

            const results = await model.find(filter)
                .sort({ date_added: -1 }) 
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();

            res.paginatedResults = {
                results,
                currentPage: page,
                totalPages
            };

            next();
        } catch (err) {
            next(err);
        }
    };
};


// Filter for Men's Dress products using an implicit return. When the arrow function's body is a single expression enclosed in parentheses, the expression's result is returned automatically.
const menDressFilter = (req) => ({ productCategory: "Men's Dress" });
const womenDressFilter = (req) => ({ productCategory: "Women's Dress" });
const babyDressFilter = (req) => ({ productCategory: "Baby's Dress" });
const JeansFilter = (req) => ({ productCategory: "Jeans" });
const BlazersFilter = (req) => ({ productCategory: "Blazers" });
const JacketsFilter = (req) => ({ productCategory: "Jackets" });
const SwimwearsFilter = (req) => ({ productCategory: "Swimwears" });
const SleepwearsFilter = (req) => ({ productCategory: "Sleepwears" });
const SportswearsFilter = (req) => ({ productCategory: "Sportswears" });
const JumpsuitsFilter = (req) => ({ productCategory: "Jumpsuits" });
const loafersFilter = (req) => ({ productCategory: "loafers" });
const SneakersFilter = (req) => ({ productCategory: "Sneakers" });


// fliter to diaply order for user and merchant that sign in . 
const userOrdersFilter = (req) => {
    if (req.currentUser) {
        return { user: req.currentUser._id };
    }
    return {};
};
const merchantOrdersFilter = (req) => {
    if (req.currentMerchant) {
        return { 'cartItems.merchantId': req.currentMerchant._id };
    }
    return {};
};

const merchantProductsFilter = (req) => {
    if (req.currentMerchant) {
        return { merchantId: req.currentMerchant._id };
    }
    return {};
};


module.exports = {
    paginatedResults,menDressFilter,
    womenDressFilter,babyDressFilter,
    JeansFilter,BlazersFilter,
    JacketsFilter,SwimwearsFilter,
    SleepwearsFilter,SportswearsFilter,
    JumpsuitsFilter,loafersFilter,
    SneakersFilter,
    
    userOrdersFilter,
    merchantOrdersFilter,merchantProductsFilter
 };



































//  'use strict';

// const paginatedResults = (model, filter = {}) => {
//     return async (req, res, next) => {
//         try {
//             const page = parseInt(req.query.page) || 1;
//             const perPage = 6; // Number of items per page

//             // Check if user is authenticated If authenticated, filter orders by the current user
//             if (req.currentUser) {
//                 filter.user = req.currentUser._id;
//             }
            
//             const totalItems = await model.countDocuments(filter);
//             const totalPages = Math.ceil(totalItems / perPage);

//             const results = await model.find(filter)
//                 .sort({ date_added: -1 }) 
//                 .skip((page - 1) * perPage)
//                 .limit(perPage)
//                 .exec();

//             res.paginatedResults = {
//                 results,
//                 currentPage: page,
//                 totalPages
//             };

//             next();
//         } catch (err) {
//             next(err);
//         }
//     };
// };


// module.exports = paginatedResults;
