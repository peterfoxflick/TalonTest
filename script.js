


function test1(){
  var profileID = "JAMES-TALON-TEST-" + Math.floor(Math.random() * 9999);
  var name = "James"
  var couponCode = ''

  console.log("clicked + " + profileID)

  let profile = {
    "attributes": {
      "Name": name
    },
    "responseContent": [
      "ruleFailureReasons"
    ]
  }

  sendRequest('/v2/customer_profiles/' + profileID + '?runRuleEngine=true', 'PUT', profile).then(res => {
    console.log(res)
    let results = []

    let effects = res.effects
    //TEST 1
    if(effects.find(e => e.effectType == "couponCreated")){
      results.push({"status":"Pass", "text":"Create coupon for new profiles"})
      couponCode = effects.find(e => e.effectType == "couponCreated").props.value
    } else {
      results.push({"status":"Fail", "text":"Create coupon for new profiles"})
    }

    //Test 2
    if(effects.find(e=> e.effectType == "showNotification" && e.props.body.includes(couponCode) &&  e.props.body.includes(name))){
      results.push({"status":"Pass", "text":"Send notification with coupon code and profile name"})
    } else {
      results.push({"status":"Fail", "text":"Send notification with coupon code and profile name"})
    }


    let resultsHTML = generateList(results)
    document.getElementById('test1Results_part1').innerHTML = resultsHTML
  }).then(results =>{

      let session = {
        "customerSession": {
            "profileId": profileID,
            "state": "open",
            "cartItems": [
                {
                    "name": "Tapas",
                    "sku": "A",
                    "quantity": 1,
                    "price": 10,
                    "category": "Appetizer",
                    "weight": 0,
                    "position": 0
                },
                {
                    "name": "Big Mac",
                    "sku": "C",
                    "price": 18,
                    "quantity": 1,
                    "category": "Burger",
                    "weight": 0,
                    "position": 1
                }
            ],
            "couponCodes": [
              couponCode
           ],
            "attributes": {
            },
            "additionalCosts": {

            },
            "referralCode": ""
        },
        "responseContent": [
            "customerSession",
            "customerProfile",
            "coupons"
        ]
      }
      sendRequest('/v2/customer_sessions/TEST-890432', 'PUT', session).then(res => {
        console.log(res);
        let results = []

        let effects = res.effects

        //TEST 1
        if(effects.find(e => e.effectType == "setDiscount" && e.props.value == 5.6)){
          results.push({"status":"Pass", "text":"Set discount to 20%"})
        } else {
          results.push({"status":"Fail", "text":"Set discount to 20%"})
        }

        let resultsHTML = generateList(results)
        document.getElementById('test1Results_part2').innerHTML = resultsHTML
      }).then(r=>{

              let session = {
                "customerSession": {
                    "profileId": profileID,
                    "state": "open",
                    "cartItems": [
                        {
                            "name": "Tapas",
                            "sku": "A",
                            "quantity": 51,
                            "price": 1000,
                            "category": "Appetizer",
                            "weight": 0,
                            "position": 0
                        }
                    ],
                    "couponCodes": [
                      couponCode
                   ],
                    "attributes": {
                    },
                    "additionalCosts": {

                    },
                    "referralCode": ""
                },
                "responseContent": [
                    "customerSession",
                    "customerProfile",
                    "coupons"
                ]
              }
              sendRequest('/v2/customer_sessions/TEST-890432', 'PUT', session).then(res => {
                console.log(res);
                let results = []

                let effects = res.effects

                //TEST 1
                if(effects.find(e => e.effectType == "setDiscount" && e.props.value > 10000)){
                  results.push({"status":"Fail", "text":"Budget at 10k"})
                } else {
                  results.push({"status":"Pass", "text":"Budget at 10k"})
                }

                let resultsHTML = generateList(results)
                document.getElementById('test1Results_part3').innerHTML = resultsHTML
              })

      })
  })
}


function oldsendRequest(){
  let baseUrl = document.getElementById("talonUrl").value
  let apiKey = 'ApiKey-v1 ' + document.getElementById("apiKey").value
//  https://{{URL}}.talon.one/v2/customer_sessions/{{Session_id}}_089345
  let url = "https://" + baseUrl + "/v2/customer_sessions/TEST-1234_089345"
  console.log(url);
  fetch(url, {
    method: "GET",
    headers: {
       'Authorization': apiKey
     }

  }).then(response => response.json())
    .then(res => {
        console.log(res)
  });

}

//Basic request
async function sendRequest(url = '',  method = 'GET', data = {}) {
  let baseUrl = document.getElementById("talonUrl").value
  let apiKey = 'ApiKey-v1 ' + document.getElementById("apiKey").value
  let fullUrl = "https://" + baseUrl + url

  const response = await fetch(fullUrl, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey
    },
    body: JSON.stringify(data)
  });
  return response.json();
}



function generateList(items){
  let html = `<ul class="list-group">`

  items.forEach(i=>{
    if(i.status == "Pass"){
      html += `<li class="list-group-item list-group-item-success">` + i.text + `</li>`
    } else {
      html += `<li class="list-group-item list-group-item-danger">` + i.text + `</li>`
    }
  })
  html += `</ul>`
  return html
}
