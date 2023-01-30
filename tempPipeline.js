[
  {
    $match: {
      post: new ObjectId("63d73abdbba83fef68241624"),
    },
  },
  {
    $group: {
      _id: "$post",
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
