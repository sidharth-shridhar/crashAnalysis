
const cities = [];
    const crashCountPerCity = []
    const crashCountPerDay = []
    const vehicle = []
    const crashByVehicle =[]
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let m = []
    // const grouping1 =0 ;
    async function getData() {
        const response = await fetch('https://data.cityofnewyork.us/resource/h9gi-nx95.json');
        const data = await response.json();
        console.log(data);
        const filterCities = data.filter(it => it.borough != undefined);
        
        const addCrashDay = data.map(it => {
            const day_index = new Date(it.crash_date).getDay()
            it.crash_day = days[day_index]
            return it
        });

        const crashesByVehicleType = data.reduce((acc, it) => {
        acc[it.vehicle_type_code1] = acc[it.vehicle_type_code1] + 1 || 1;
        return acc;
        }, {});
        // let sedan_count = data.filter(d => d.vehicle_type_code1.includes("Sedan"))

        const crashesPerCity = filterCities.reduce((acc, it) => {
        acc[it.borough] = acc[it.borough] + 1 || 1;
        return acc;
        }, {});

        const count = filterCities.reduce((acc, it) => {
        acc[it.contributing_factor_vehicle_1] = acc[it.contributing_factor_vehicle_1] + 1 || 1;
        return acc;
        }, {});
        let max = 0;
        majorFact = ""
        for(let key in count) {
            if(max < count[key] && key != "Unspecified"){
                majorFact = key
                max = count[key]
            }
        }
        

        document.getElementById("sight1").innerHTML = majorFact
        document.getElementById("sight2").innerHTML = max

        

        const crashesPerDay = addCrashDay.reduce((acc = [], it) => {
        acc[it.crash_day] = acc[it.crash_day] + 1 || 1;
        return acc;
        }, {});

        const sorter = {
        "monday": 1,
        "tuesday": 2,
        "wednesday": 3,
        "thursday": 4,
        "friday": 5,
        "saturday": 6,
        "sunday": 7
        };

        let tmp = [];
        Object.keys(crashesPerDay).forEach(function(key) {
        let value = crashesPerDay[key];
        let index = sorter[key.toLowerCase()];
        tmp[index] = {
            key: key,
            value: value
        };
        });

        let orderedData = {};
        tmp.forEach(function(obj) {
        orderedData[obj.key] = obj.value;
        });

        
        for (let key in crashesPerCity) {
            cities.push(key);
            crashCountPerCity.push(crashesPerCity[key])
        }  


        for (let key in crashesByVehicleType) {
            if(crashesByVehicleType[key] > 20) {
                vehicle.push(key);
                crashByVehicle.push(crashesByVehicleType[key])
            }
        }

        let sum = 0
        const total = crashByVehicle.map(it => {
            sum += it
            return sum
        })

        m = crashByVehicle.map(it => it/sum * 100)



        days = []
        for (let key in orderedData) {
            days.push(key);
            crashCountPerDay.push(orderedData[key])
        }  
        //console.log(cities);
        // console.log(arr);
        // document.getElementById("image").src = data.message
    }
    chartIt();
    async function chartIt(){
        await getData();
        const ctx = document.getElementById('barChart').getContext('2d');
        const ctx1 = document.getElementById('lineChart').getContext('2d');
        const ctx2 = document.getElementById('pieChart').getContext('2d');
        
        const myChart1 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cities,
                datasets: [{
                    label: 'Crash Stats',
                    data: crashCountPerCity,
                    backgroundColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
            },
        });

        const myChart2 = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Crash Stats',
                    data: crashCountPerDay,
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                    borderWidth: 2,
                    borderColor : 'rgba(75, 192, 192, 1)',
                    lineTension: 0
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
            },
        });

        const myChart3 = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: vehicle,
                datasets: [{
                    label: 'Crash Stats',
                    data: m,
                    backgroundColor: [ 
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
            },
        });
    }  