app.controller('MainCtrl', ['$scope', '$http', '$location', '$cookieStore', function ($scope, $http, $location, $cookieStore) {

    $scope.ask_user_type_show = false;
    $scope.ask_user_type = function () {

        $cookieStore.put('before_login_page', $location.path());
        $scope.ask_user_type_show = !$scope.ask_user_type_show;

    }

            //  $scope.stylesheets = [
            //       {href: '../../css/reset.css', type:'text/css'},
            //       {href: '../../css/style.css', type:'text/css'},
            //       {href: '../../pages/admin/css/reset.css', type:'text/css'},
            //       {href: '../../pages/admin/css/style.css', type:'text/css'},
            //       {href: '../../pages/admin/css/media.css', type:'text/css'},
            //       {href: '../../pages/admin/fonts/font-awesome/css/font-awesome.min.css', type:'text/css'},


            //     ];

            // $scope.scripts = [

            //   {href: '../../pages/admin/js/fm.parallaxator.jquery.js', type:'text/javascript'},
            //   {href: '../../pages/admin/js/global.js', type:'text/javascript'},
            //   {href: '../../pages/admin/js/min.js', type:'text/javascript'},


            // ];



}]);


app.controller('location_controller', ['$scope', '$http', '$cookieStore', '$location', '$timeout', '$rootScope', 'cfpLoadingBar', function ($scope, $http, $cookieStore, $location, $timeout, $rootScope, cfpLoadingBar) {
    cfpLoadingBar.start();

    $('#autocomplete').change(function () {
        alert('hello');
    });

    $scope.GetAddress = function () {

        var tt = "";
        $scope.locate_val = "Test Me";

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function (p) {
                LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
                var mapOptions = {
                    center: LatLng,
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                GetAddress(p.coords.latitude, p.coords.longitude, LatLng);

                console.log(p.coords.latitude);
                console.log(p.coords.longitude);
                $scope.u = {};
                $scope.u.lat = p.coords.latitude;
                $scope.u.long = p.coords.longitude;

                $cookieStore.put('user_lat_long', $scope.u);

            });
        } else {
            alert('Geo Location feature is not supported in this browser.');

        }

        function GetAddress(lat, lng, add) {

            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': add }, function (results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {

                        // results[0].address_components[1].short_name+','+

                        tt = results[0].address_components[2].short_name;
                        //	console.log(results[0].address_components[1].short_name+','+results[0].address_components[2].long_name);
                        $("#location").text(tt);
                        $("#autocomplete").val(results[1].formatted_address);
                        $.cookie('eatoeato.loc', results[0].address_components[2].long_name);

                        //  $.cookie('user_lat_lon', results);

                        setTimeout(
                            function () {
                                window.location.href = '#/listing';
                            }, 2000);

                        console.log(tt);
                    }
                }
            });
        }



    }

    $rootScope.loc = "";
    $scope.selected_location = function (loc) {
        //       console.log($.cookie('eatoeato.loc'));



        var geocoder = new google.maps.Geocoder();
        var address = $.cookie('eatoeato.loc');




        $timeout(function () {
            var formatted_address = $.cookie('formatted_addr');
            console.log(formatted_address);
            geocoder.geocode({ 'address': formatted_address }, function (results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    $scope.u = {};
                    $scope.u.lat = latitude;
                    $scope.u.long = longitude;

                    $cookieStore.put('user_lat_long', $scope.u);
                    console.log('this is USER');
                    window.location.href = '#/listing';
                    //       //  console.log(results[0] );
                    //          $timeout(function () {


                    // }, 3000);

                }
            });

        }, 3000);


    }


}]);
app.controller('home_controller', ['$scope', '$http', '$rootScope', '$cookieStore', 'cfpLoadingBar', '$sce', function ($scope, $http, $rootScope, $cookieStore, cfpLoadingBar, $sce) {
    cfpLoadingBar.start();
    $rootScope.stylesheets = "";   //load according to page rendering ..

    $rootScope.stylesheets = [
        { href: '../../public/css/reset.css', type: 'text/css' },
        { href: '../../public/css/style.css', type: 'text/css' },

    ];


    //DATA FOR FOOTER LINKS

    $scope.social_footer_link = {};
    $scope.footer_link = {};
    $scope.footer_link_quick_links;

    $scope.footer_link_privay;
    $scope.fetch_footer_detail = function () {


        $http({
            method: "GET",
            url: "admin/fetch-footer-details",

        }).then(function mySucces(response) {


            $scope.social_footer_link = response.data[0];
            $scope.footer_link_quick_links;

            var quick_links = [];
            var policy_info = [];

            for (var i = 0; i < response.data[1].length; i++) {

                if (response.data[1][i].info_tag == "quick_links") {
                    quick_links.push(response.data[1][i]);
                }
                else if (response.data[1][i].info_tag == "policy_info") {
                    policy_info.push(response.data[1][i]);
                }

            }
            $scope.footer_link_quick_links = quick_links;
            $scope.footer_link_privay = policy_info;

            console.log(policy_info);
        }, function myError(response) {

        });
    };

    $scope.save_info_temp = function (val) {

        console.log(val);

        $cookieStore.put('footer_temp', val);

    }

    $scope.footer_page = {};
    $scope.get_footer_info = function () {

        var page = $cookieStore.get('footer_temp');
        $scope.footer_page = page;

    }
    $scope.toTrustedHTML = function (html) {
        return $sce.trustAsHtml(html);
    }




}]);

//THIS CONTROLLER IS FOR RIGHT MENU --to check if user is logged in or not

app.controller('right_menu_controller', ['$scope', '$http', '$cookieStore', '$location', function ($scope, $http, $cookieStore, $location) {



    $scope.login_button_show = false;
    $scope.logout_button_show = false;
    $scope.login_logout_button_check = function () {


        if ($cookieStore.get('s3cr3t_user') == undefined && $cookieStore.get('cook_logged_in') == undefined) {

            $scope.login_button_show = true;
            $scope.logout_button_show = false;
        }


        if ($cookieStore.get('s3cr3t_user') != undefined) {
            $scope.login_button_show = false;
            $scope.logout_button_show = true;
        }
        if ($cookieStore.get('cook_logged_in') != undefined) {
            $scope.login_button_show = false;
            $scope.logout_button_show = true;
        }
    }

    $scope.logged_in_user_check_for_dashboard = function () {

        //console.log($cookieStore.get('s3cr3t_user'));
        if ($cookieStore.get('s3cr3t_user') == undefined) {
            $scope.when_location_selected = true;
        }
        else if ($cookieStore.get('s3cr3t_user') != undefined) {

            $scope.when_location_selected = true;

        }
    }


    $scope.get_details_for_logged_in_user_right_menu = function () {

        $scope.user_details = {};
        $scope.user = {};
        $scope.user.user_id = $cookieStore.get('s3cr3t_user')
        $http({
            method: "POST",
            url: "user/get-user-details",
            data: $scope.user
        }).then(function mySucces(response) {

            $scope.user_details = response.data;
            console.log(response.data);
        }, function myError(response) {

        });

    }

    $scope.logout_for_user_cook = function () {

        // if ($cookieStore.get('cook_logged_in') == undefined) {
        //     $location.path('/cook_login');

        // }
        if ($cookieStore.get('s3cr3t_user') != undefined && $cookieStore.get('s3cr3t_user') != "") {
            setTimeout(function () {
                swal({
                    title: "Logout Successfully",
                    text: "All Cached Data Removed..",
                    type: "success",
                    confirmButtonText: "OK"
                },
                    function (isConfirm) {
                        if (isConfirm) {

                            $cookieStore.remove("s3cr3t_user");
                            window.location.href = "#/user_login";

                            $scope.login_button_show = true;
                            $scope.logout_button_show = false;

                        }
                    });
            }, 100);

        }
        else if ($cookieStore.get('cook_logged_in') != undefined && $cookieStore.get('cook_logged_in') != "") {
            setTimeout(function () {
                swal({
                    title: "Logout Successfully",
                    text: "All Cached Data Removed..",
                    type: "success",
                    confirmButtonText: "OK"
                },
                    function (isConfirm) {
                        if (isConfirm) {

                            $cookieStore.remove("cook_logged_in");
                            window.location.href = "#/cook_login";

                            $scope.login_button_show = true;
                            $scope.logout_button_show = false;

                        }
                    });
            }, 100);

        }


        // else {
        //     setTimeout(function () {
        //         swal({
        //             title: "Logout Successfully",
        //             text: "All Cached Data Removed..",
        //             type: "success",
        //             confirmButtonText: "OK"
        //         },
        //             function (isConfirm) {
        //                 if (isConfirm) {

        //                     $cookieStore.remove("cook_logged_in");
        //                     window.location.href = "#/cook_login";
        //                     $location.path('/cook_login');
        //                     $scope.login_button_show = true;
        //                     $scope.logout_button_show = false;

        //                 }
        //             });
        //     }, 100);



        // }


    };

    $scope.login_check_for_cook = function () {

        if ($cookieStore.get('cook_logged_in') == undefined || $cookieStore.get('cook_logged_in') == "") {

            $scope.login_button_show = true;
            $scope.logout_button_show = false;
            window.location.href = "#/cook_login";
        }

        else {


            $scope.login_button_show = false;
            $scope.logout_button_show = true;

        }

    }



    $scope.view_cart_val = {};
    $scope.manage_cart_total = {};



}]);


app.controller('cook_controller', ['$scope', '$http', '$rootScope', 'cfpLoadingBar', function ($scope, $http, $rootScope, cfpLoadingBar) {
    cfpLoadingBar.start();
    $rootScope.food_details = {};
    $scope.occassions = ['Breakfast', 'Lunch', 'Brunch', 'Dinner'];
    $scope.deliveryRange = ['within 1 km', 'Within 2km'];

    $rootScope.selection_for_occasion = [];
    $rootScope.selection_for_cuisines = [];
    // selected fruits  
    $scope.selection = [];

    // toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(val) {

        var idx = $scope.selection.indexOf(val);

        // is currently selected
        if (idx > -1) {

            $scope.selection.splice(idx, 1);
            console.log($scope.selection);
        }

        // is newly selected
        else {
            // val.status='true';
            // $scope.selection.push(val);
            var len = $rootScope.selection_for_occasion.length;
            for (var i = 0; i < len; i++) {

                if ($rootScope.selection_for_occasion[i].group_attr == val.group_attr && $rootScope.selection_for_occasion[i].status == 'false') {

                    $rootScope.selection_for_occasion[i].status = 'true';
                }
                else if ($rootScope.selection_for_occasion[i].group_attr == val.group_attr && $rootScope.selection_for_occasion[i].status == 'true') {

                    $rootScope.selection_for_occasion[i].status = 'false';
                }
                else {

                }
            }

            console.log($rootScope.selection_for_occasion);
            $scope.food_details.occassion_list = $rootScope.selection_for_occasion;
        }
    }

    $scope.selection2 = [];

    // toggle selection for a given fruit by name
    $scope.toggleSelection2 = function toggleSelection2(val) {
        var idx = $scope.selection2.indexOf(val);

        // is currently selected
        if (idx > -1) {
            $scope.selection2.splice(idx, 1);
        }

        // is newly selected
        else {

            var len = $rootScope.selection_for_cuisines.length;
            for (var i = 0; i < len; i++) {

                if ($rootScope.selection_for_cuisines[i].category_name == val.category_name && $rootScope.selection_for_cuisines[i].status == 'false') {

                    $rootScope.selection_for_cuisines[i].status = 'true';
                }
                else if ($rootScope.selection_for_cuisines[i].category_name == val.category_name && $rootScope.selection_for_cuisines[i].status == 'true') {

                    $rootScope.selection_for_cuisines[i].status = 'false';
                }
                else {

                }
            }

            console.log($rootScope.selection_for_cuisines);
            $scope.food_details.cuisine_types = $rootScope.selection_for_cuisines;
        }
    }


    $scope.test = function () {

        $http({
            method: "GET",
            url: "foods/food-details"
        }).then(function mySucces(response) {

            console.log(response);
        }, function myError(response) {

        });


    }

    $scope.save = function () {

        $http({
            method: "POST",
            url: "foods/food-details"
        }).then(function mySucces(response) {

            console.log(response);
        }, function myError(response) {

        });


    }


}]);


app.controller('product', ['$scope', '$http', function ($scope, $http) {
    // $http.get('data/products.json').then(function (response) {
    //     $scope.products = response.data;
    // });
}]);


app.controller('user_info', ['$scope', '$http', function ($scope, $http) {

    $scope.user_details = {};



    $scope.add_user_info = function (user_info) {


        $http({
            method: "POST",
            url: "user/add-user-info",
            data: user_info
        }).then(function mySucces(response) {

            console.log(response);
        }, function myError(response) {

        });


    }

}]);

/***************************COOK CONTROLLER********************************************* */

app.controller('cook_register', ['$scope', '$http', '$location', '$cookieStore', '$timeout', '$base64', '$window', '$rootScope', 'cfpLoadingBar', function ($scope, $http, $location, $cookieStore, $timeout, $base64, $window, $rootScope, cfpLoadingBar) {

    cfpLoadingBar.start();

    $scope.cook_login_check_for_cookie = function () {


        if ($cookieStore.get('cook_logged_in') == undefined) {
            $location.path('/cook_login');

        } else if ($cookieStore.get('cook_logged_in') != undefined) {


        }
    }

    $scope.check_if_cook_basic_entered_complete_pending = function () {

        if ($cookieStore.get('basic_entered_complete_pending') == undefined) {

            $location.path('/cook_create');
        } else {
            console.log('cookie found');
            $location.path('/cook_basic_info');
        }
    }



    $scope.logout = function () {

        if ($cookieStore.get('cook_logged_in') == undefined) {
            $location.path('/cook_login');

        } else {
            $cookieStore.remove("cook_logged_in");
            $location.path('/');

        }
    };
    $scope.cook_details = {};

    $scope.cook_success_detail = {};

    $scope.cook_complete_details = {};
    $scope.cook_initial_info = {} //this is used when cook 1 st step registration completed

    $scope.after_success_reg_message = false;

    $scope.after_success_login_message = false;
    $scope.after_failed_login_message = false;
    $scope.already_register_check = false;

    $scope.isDisabled = false; $scope.error_check1 = false;
    $scope.show_company = false;
    $scope.show_basic = true;
    $scope.show_food_section = false;

    $scope.getCookRegisterData = function () {

        if ($cookieStore.get('basic_entered_complete_pending') == undefined) {

            $location.path('/cook_food');
        }
        else if ($cookieStore.get('cook_logged_in') != undefined) {

            $location.path('/cook_food');
        }
        else {
            console.log('cookie found');
            $scope.cook_complete_details = $cookieStore.get('basic_entered_complete_pending');
        }


    }

    $scope.form_section = function () {

        if ($scope.show_basic == true && $scope.show_company == false && $scope.show_food_section == false) {
            $scope.show_basic = false;
            $scope.show_company = true;
            $scope.show_food_section = false;
        }
        else if ($scope.show_basic == false && $scope.show_company == true && $scope.show_food_section == false) {
            $scope.show_basic = false;
            $scope.show_company = false;
            $scope.show_food_section = true;
        }

    }
    $scope.form_section_back_button = function () {

        console.log('back');
        $scope.show_basic == false;
        $scope.show_company == true;
        $scope.show_food_section == false;
        if ($scope.show_basic == true && $scope.show_company == false && $scope.show_food_section == false) {
            $scope.show_basic = false;
            $scope.show_company = true;
            $scope.show_food_section = false;
        }
        else if ($scope.show_basic == false && $scope.show_company == true && $scope.show_food_section == false) {
            $scope.show_basic = true;
            $scope.show_company = false;
            $scope.show_food_section = false;
        }

    }
    $scope.add_cook_details = function (cook_details) {

        // $scope.u = cook_details;
        // $scope.cook_details = "";

        // $scope.error_check1 = false;
        // $scope.isDisabled = true;

        // $http({
        //     method: "POST",
        //     url: "cook/add-cook-info",
        //     data: $scope.u
        // }).then(function mySucces(response) {


        setTimeout(function () {
            swal({
                title: "Information Saved.!",
                text: "Next..Complete your Profile Detail",
                type: "success",
                confirmButtonText: "OK"
            },
                function (isConfirm) {
                    if (isConfirm) {
                        // $scope.cook_success_detail = response.data[0];

                        $cookieStore.put('cook_basic_info', cook_details);
                        //$location.path('/cook_profile');
                        window.location.href = "#/cook_basic_info";
                    }
                });
        }, 100);

        // $scope.after_success_reg_message = true;

        // $timeout(function () {
        //     $scope.cook_complete_details = response.data;

        //     $cookieStore.put('basic_entered_complete_pending', $scope.cook_complete_details);
        //     $scope.after_success_reg_message = false;
        //     $location.path('/cook_basic_info');
        //     $scope.isDisabled = false;

        // }, 4000);

        // console.log($scope.cook_complete_details);

        //    console.log(response.data.cook_name);

        // }, function myError(response) {
        //     $scope.cook_details = "";
        //     $scope.already_register_check = true;
        //     $timeout(function () {
        //         $scope.already_register_check = false;

        //     }, 4000);

        //     console.log('EMAIL ALREADY EXIST');
        // });




    }
    $scope.fill_temp_cook_data = function () {

        var tmp = {};
        console.log($cookieStore.get('cook_basic_info'));
        tmp = $cookieStore.get('cook_basic_info');
        $scope.cook_complete_details.cook_name = tmp.cook_name;
        $scope.cook_complete_details.cook_email = tmp.cook_email;
        $scope.cook_complete_details.cook_contact = tmp.cook_contact_no;

    }
    $scope.cook_status = false;

    $scope.cook_login_check = function (cook_login) {

        //  console.log(cook_login);
        $http({
            method: "POST",
            url: "cook/cook_login_check",
            data: cook_login
        }).then(function mySucces(response) {


            setTimeout(function () {
                swal({
                    title: "Credentials Verified !",
                    text: "You Can Access Your Account Panel Now.",
                    type: "success",
                    confirmButtonText: "OK"
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            $scope.cook_success_detail = response.data[0];
                            $cookieStore.put('cook_logged_in', response.data[0]._id);
                            //$location.path('/cook_profile');
                            window.location.href = "#/cook_profile";
                        }
                    });
            }, 100);
            //sweetAlert("Credentials Verified", "You Can Access Your Account Panel Now.", "success");

            // $scope.cook_login = "";
            // 
            // $scope.after_success_login_message = true;
            // $cookieStore.put('cook_logged_in', response.data[0]._id);
            // $timeout(function () {


            //     $scope.after_success_login_message = false;
            //     


            // }, 4000);

        }, function myError(response) {

            if (response.status == 401) {
                sweetAlert("Un Authorized", "Check credentials Again.", "error");
                console.log('unath');
                // $scope.after_failed_login_message = true;
                // $timeout(function () {
                //     $scope.after_failed_login_message = false;

                // }, 4000);
            }
            // else if (response.data == "account disabled") {

            //     $scope.cook_status = true;
            //     $timeout(function () {
            //         $scope.cook_status = false;

            //     }, 4000);
            // }

        });

    }
    // Activation status of User

    $scope.vv = '';
    $scope.check_activation_status = function () {

        $scope.u = {};
        $scope.u.cook_id = $cookieStore.get('cook_logged_in')

        $http({
            method: "POST",
            url: "cook/get-cook-activation-status",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log('PROFILE STATUS');
            $scope.vv = response.data;

            if (response.data == "Approved") {
                $scope.vv = "Approved"
            }
            if (response.data == "Un Appr") {
                $scope.vv = "Pending For Approval"
            }
            if (response.data == "updated") {
                $scope.vv = "Pending For Approval"
            }

            console.log(response);

        }, function myError(response) {



        });
    }

    // Activation status of User

    $scope.cook_profile_complete = function (cook_all_details) {

        $scope.u = {};
        $scope.u.profile_detail = cook_all_details;
        var tmp = $cookieStore.get('cook_basic_info');
        $scope.u.basic_detail = tmp;

        console.log($scope.u);
        $http({
            method: "POST",
            url: "cook/add-cook-info",
            data: $scope.u
        }).then(function mySucces(response) {

            setTimeout(function () {
                swal({
                    title: "Thank You !",
                    text: "Your Details are Pending For Admin Approval \n \n In the mean time you can login and view your details",
                    type: "success",
                    confirmButtonText: "OK"
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            // $scope.cook_success_detail = response.data[0];
                            // $cookieStore.put('cook_logged_in', response.data[0]._id);
                            //$location.path('/cook_profile');
                            window.location.href = "#/cook_login";
                        }
                    });
            }, 100);

            $cookieStore.remove("cook_basic_info");
            //         // $cookieStore.put('cook_logged_in', response.data._id);

            //         // $location.path('/cook_food');

        }, function myError(response) {

        });



    }

    $scope.cook_password_update_detail = {};
    $scope.after_success_pass_update = false;
    $scope.after_failed_pass_update = false;


    $scope.cook_password_update = function (pass_update_detail) {


        $scope.u = pass_update_detail;
        $scope.cook_password_update_detail = "";
        $scope.u.cook_id = $cookieStore.get('cook_logged_in');
        console.log($scope.u);

        $http({
            method: "POST",
            url: "cook/cook-pass-update",
            data: pass_update_detail
        }).then(function mySucces(response) {


            $scope.after_success_pass_update = true;
            $timeout(function () {

                $scope.after_success_pass_update = false;

            }, 3000);

        }, function myError(response) {


            $scope.after_failed_pass_update = true;
            $timeout(function () {

                $scope.after_failed_pass_update = false;

            }, 3000);
        });

    }

    $scope.cook_acount_deactivate_details = {};
    $scope.after_success_account_deactivate = false;
    $scope.after_failed_account_deactivate = false;

    $scope.deactivate_cook = function (cook_deactivate_detail) {

        $scope.u = $scope.cook_acount_deactivate_details;
        $scope.u.cook_id = $cookieStore.get('cook_logged_in');
        //  $scope.manage_account_update_user="";
        console.log($scope.u);
        $http({
            method: "POST",
            url: "cook/cook-account-deactivate",
            data: $scope.u
        }).then(function mySucces(response) {
            console.log(response);
            $scope.cook_acount_deactivate_details = "";

            $scope.after_success_account_deactivate = true;
            $timeout(function () {

                $scope.after_success_account_deactivate = false;
                $cookieStore.remove("cook_logged_in");
                $location.path('/');
            }, 5000);

        }, function myError(response) {
            console.log(response);
            $scope.after_failed_account_deactivate = true;
            $timeout(function () {

                $scope.after_failed_account_deactivate = false;

            }, 3000);

        });


    }


    $scope.after_success_profile_update = false;
    // $scope.cook_profile_update_data={};
    // $scope.cook_profile_update_status=false;
    $scope.cook_profile_update = function (cook_time_data) {

        $scope.u = cook_time_data;
        if (!$scope.u.available_hours.hasOwnProperty('mon_from')) {

            $scope.u.available_hours.mon_from = '';
            $scope.u.available_hours.mon_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('tue_from')) {

            $scope.u.available_hours.tue_from = '';
            $scope.u.available_hours.tue_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('tue_from')) {

            $scope.u.available_hours.tue_from = '';
            $scope.u.available_hours.tue_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('tue_from')) {

            $scope.u.available_hours.tue_from = '';
            $scope.u.available_hours.tue_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('wed_from')) {

            $scope.u.available_hours.wed_from = '';
            $scope.u.available_hours.wed_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('thu_from')) {

            $scope.u.available_hours.thu_from = '';
            $scope.u.available_hours.thu_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('fri_from')) {

            $scope.u.available_hours.fri_from = '';
            $scope.u.available_hours.fri_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('sat_from')) {

            $scope.u.available_hours.sat_from = '';
            $scope.u.available_hours.sat_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('sun_from')) {

            $scope.u.available_hours.sun_from = '';
            $scope.u.available_hours.sun_to = '';
        }

        $scope.u.cook_id = $cookieStore.get('cook_logged_in');
        console.log($scope.u);

        $scope.cook_profile_update_data = "";


        swal({
            title: "Are you sure?",
            text: "You Are Going To Update Your Profile Details !",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Go Ahead !",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    $http({
                        method: "POST",
                        url: "cook/cook-profile-update",
                        data: $scope.u
                    }).then(function mySucces(response) {

                        swal("Updated !", "Your Personal Details Successfully Updated :)", "success");

                    }, function myError(response) {


                    });


                } else {
                    swal("Cancelled", "Your cancelled to Update Profile Details :)", "error");
                }
            });

    }



    $scope.cook_data_for_view = {};

    $scope.get_cook_profile_data = function () {

        $scope.u = {};

        $scope.u.cook_id = $cookieStore.get('cook_logged_in');

        $http({
            method: "POST",
            url: "cook/get-cook-profile-data",
            data: $scope.u
        }).then(function mySucces(response) {
            $scope.cook_data_for_view = response.data[0];
            console.log($scope.cook_data_for_view);
            //       $scope.cook_profile_update_status=true;
            //     $timeout( function()
            // { 
            //     console.log('yessssssss');
            //        $scope.cook_profile_update_status=false;                

            // }, 3000);

        }, function myError(response) {


        });
    };

    $scope.imageData_cook_prof = "";
    $scope.upload_cook_profile_image = function (files) {

        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('file').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            $scope.imageData_cook_prof = $base64.encode(data);

            //console.log($scope.imageData);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);

    }

    $scope.imageData_cook_banner = "";
    $scope.upload_cook_banner_image = function (files) {

        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('file2').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            $scope.imageData_cook_banner = $base64.encode(data);

            //console.log($scope.imageData);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);

    }




    $scope.after_success_company_details = false;

    $scope.update_cook_company_details = function () {

        $scope.cook_data_for_view.cook_id = $cookieStore.get('cook_logged_in');

        $scope.cook_data_for_view.cook_banner_img = $scope.imageData_cook_banner;

        console.log($scope.cook_data_for_view);

        $http({
            method: "POST",
            url: "cook/cook-company-details-update",
            data: $scope.cook_data_for_view
        }).then(function mySucces(response) {

            setTimeout(function () {
                swal({
                    title: "Updated.!",
                    text: "Your Company Details Has Been Updated.",
                    type: "success",
                    confirmButtonText: "OK"
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            // $scope.cook_success_detail = response.data[0];
                            $scope.get_cook_profile_data();
                        }
                    });
            }, 100);





        }, function myError(response) {


        });
    }

    $scope.cuisine_list = {};
    $scope.get_cuisines = function () {

        $http({
            method: "GET",
            url: "cook/get-cuisines-list",

        }).then(function mySucces(response) {

            $scope.cuisine_list = response.data;
            $rootScope.selection_for_cuisines = $scope.cuisine_list;

            console.log(response);

        }, function myError(response) {


        });
    }

    $scope.occ_list = {};
    $scope.veg_list = {};

    $scope.get_occassion_and_veg_type = function () {

        $http({
            method: "GET",
            url: "cook/get-occ-veg-list",

        }).then(function mySucces(response) {

            $scope.veg_list = response.data[1].attr_fields;
            $scope.occ_list = response.data[0].attr_fields;

            $rootScope.selection_for_occasion = $scope.occ_list;
            console.log('ankur');
            console.log(response.data[0].attr_fields);

        }, function myError(response) {


        });
    }

    $scope.isImage = function (ext) {
        if (ext) {
            return ext == "jpg" || ext == "jpeg" || ext == "gif" || ext == "png"
        }
    }
    $scope.imageData = "";
    $scope.show_image_thumb = false;

    $scope.cook_food_details = {};

    $scope.upload_food_image = function (files) {

        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('file').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;
            $scope.show_image_thumb = true;
            $scope.imageData = $base64.encode(data);

            //   console.log($scope.imageData);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);

    }


    $scope.upload_food_image2 = function (files) {


        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('file2').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            $scope.imageData = $base64.encode(data);

            //   console.log($scope.imageData);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);


    }


    $scope.after_success_food_add = false;
    $scope.save_food_details = function (save_food_details) {

        $scope.u = save_food_details;
        if (!$scope.u.available_hours.hasOwnProperty('mon_from')) {

            $scope.u.available_hours.mon_from = '';
            $scope.u.available_hours.mon_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('tue_from')) {

            $scope.u.available_hours.tue_from = '';
            $scope.u.available_hours.tue_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('tue_from')) {

            $scope.u.available_hours.tue_from = '';
            $scope.u.available_hours.tue_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('tue_from')) {

            $scope.u.available_hours.tue_from = '';
            $scope.u.available_hours.tue_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('wed_from')) {

            $scope.u.available_hours.wed_from = '';
            $scope.u.available_hours.wed_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('thu_from')) {

            $scope.u.available_hours.thu_from = '';
            $scope.u.available_hours.thu_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('fri_from')) {

            $scope.u.available_hours.fri_from = '';
            $scope.u.available_hours.fri_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('sat_from')) {

            $scope.u.available_hours.sat_from = '';
            $scope.u.available_hours.sat_to = '';
        }
        if (!$scope.u.available_hours.hasOwnProperty('sun_from')) {

            $scope.u.available_hours.sun_from = '';
            $scope.u.available_hours.sun_to = '';
        }




        $scope.u.cook_id = $cookieStore.get('cook_logged_in');

        console.log($scope.u);

        swal({
            title: "Are you sure?",
            text: "You Are Going To Add Food For Listing",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Go Ahead !",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    $http({
                        method: "POST",
                        url: "cook/add-food-details",

                        data: {
                            'food_details': $scope.u,
                            'files': $scope.imageData,
                            'cook_id': $scope.cook_id
                        }
                    }).then(function mySucces(response) {


                        //   $scope.view_food_details=
                        console.log(response.data.food_details);
                        $rootScope.food_details = "";
                        $scope.imageData = "";
                        $scope.show_image_thumb = false;

                        $scope.fetch_food_details();

                        swal("Added!", "Your Food Is Pending For Admin Approval", "success");

                    }, function myError(response) {


                    });


                } else {
                    swal("Cancelled", "Your cancelled to Add Food :)", "error");
                }
            });


    }

    $scope.view_food_details = {};
    $scope.cuisine_list_details = {};
    $scope.fetch_food_details = function () {
        $scope.u = {};
        $scope.u.cook_id = $cookieStore.get('cook_logged_in');

        $http({
            method: "POST",
            url: "cook/get-cook-details",

            data: $scope.u
        }).then(function mySucces(response) {

            $scope.view_food_details = response.data;

            //   $scope.view_food_details=
            console.log($scope.view_food_details);


        }, function myError(response) {


        });
    }




    $scope.food_details_remove = function (food_remove_id) {

        $scope.u = {};
        $scope.u.food_id = food_remove_id;
        $scope.u.cook_id = $cookieStore.get('cook_logged_in');



        swal({
            title: "Are you sure?",
            text: "You Are Going To Delete Food ",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Go Ahead !",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {

                    $http({
                        method: "POST",
                        url: "cook/remove-food-details",
                        data: $scope.u

                    }).then(function mySucces(response) {

                        swal("Deleted !", "Your Food Has Been Deleted :)", "error");
                        $scope.fetch_food_details();


                    }, function myError(response) {


                    });


                } else {
                    swal("Cancelled", "Your cancelled to Delete Food :)", "error");
                }
            });




    }

    $scope.sel_for_oc_update = [];
    $scope.sel_for_cu_update = [];

    $scope.food_details_fetch = function (food_edit_id) {

        $scope.u = {};
        $scope.u.food_id = food_edit_id;
        $scope.u.cook_id = $cookieStore.get('cook_logged_in');

        $http({
            method: "POST",
            url: "cook/edit-food-details",
            data: $scope.u

        }).then(function mySucces(response) {

            console.log(response.data);

            $scope.food_details = response.data;
            $scope.sel_for_oc_update = response.data.occassion_list;
            $scope.sel_for_cu_update = response.data.cuisine_list;
            $scope.update_view_food_show = true;
            // console.log( $scope.sel_for_cu_update);
        }, function myError(response) {


        });

    }


    $scope.toggleSelection_for_occ_update = function toggleSelection(val) {


        var idx = $scope.selection.indexOf(val);

        // is currently selected
        if (idx > -1) {

            $scope.selection.splice(idx, 1);
            console.log($scope.selection);
        }

        // is newly selected
        else {
            // val.status='true';
            // $scope.selection.push(val);
            var len = $scope.sel_for_oc_update.length;
            for (var i = 0; i < len; i++) {

                if ($scope.sel_for_oc_update[i].group_attr == val.group_attr && $scope.sel_for_oc_update[i].status == 'false') {

                    $scope.sel_for_oc_update[i].status = 'true';
                }
                else if ($scope.sel_for_oc_update[i].group_attr == val.group_attr && $scope.sel_for_oc_update[i].status == 'true') {

                    $scope.sel_for_oc_update[i].status = 'false';
                } else {

                }
            }

            console.log($scope.sel_for_oc_update);
            $scope.food_details.occassion_list = $scope.sel_for_oc_update;
        }
    }


    $scope.toggleSelection_for_cus_update = function toggleSelection(val) {

        var idx = $scope.selection.indexOf(val);

        // is currently selected
        if (idx > -1) {

            $scope.selection.splice(idx, 1);
            console.log($scope.selection);
        }

        // is newly selected
        else {
            // val.status='true';
            // $scope.selection.push(val);
            var len = $scope.sel_for_cu_update.length;
            for (var i = 0; i < len; i++) {

                if ($scope.sel_for_cu_update[i].category_name == val.category_name && $scope.sel_for_cu_update[i].status == 'false') {

                    $scope.sel_for_cu_update[i].status = 'true';
                }
                else if ($scope.sel_for_cu_update[i].category_name == val.category_name && $scope.sel_for_cu_update[i].status == 'true') {

                    $scope.sel_for_cu_update[i].status = 'false';
                } else {

                }
            }

            console.log($scope.sel_for_cu_update);
            $scope.food_details.cuisine_list = $scope.sel_for_cu_update;
        }
    }

    $scope.selection = [];

    // toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(val) {

        var len = $scope.selection.length;
        // console.log(len);
        var n = {
            "group_attr": val.group_attr
        }
        var count = 0;
        var i;
        for (i = 0; i < len; i++) {
            if ($scope.selection[i].group_attr == val.group_attr) {
                count = 1;
                // $scope.selection.splice(i);
                break;
            }

        }
        if (count > 0) {
            $scope.selection.splice(i, 1);
            //   $scope.food_details.occassion_list = $scope.selection;
        }
        else {
            $scope.selection.push(n);
            //   /$scope.food_details.occassion_list = $scope.selection;
        }
        //  
        console.log($scope.selection);

    }

    $scope.selection2 = [];

    // toggle selection for a given fruit by name
    $scope.toggleSelection2 = function toggleSelection2(val) {

        var len = $scope.selection2.length;
        // console.log(len);
        var n = {
            "category_name": val.category_name
        }
        var count = 0;
        var i;
        for (i = 0; i < len; i++) {
            if ($scope.selection2[i].category_name == val.category_name) {
                count = 1;
                // $scope.selection.splice(i);
                break;
            }

        }
        if (count > 0) {
            $scope.selection2.splice(i, 1);
            $scope.food_details.cuisine_list = $scope.selection2;

        }
        else {
            $scope.selection2.push(n);
            $scope.food_details.cuisine_list = $scope.selection2;
        }

        console.log($scope.selection2);



    }

    $scope.insert_checkbox_val = function (oo) {


        $scope.selection.push(oo);
        console.log($scope.selection);
    }
    $scope.insert_checkbox_val2 = function (oo) {


        $scope.selection2.push(oo);
        console.log($scope.selection2);
    }



    $scope.update_food_details = function (food_details) {

        console.log(food_details);
        $scope.u = {};
        $scope.u.update_food_details = food_details;

        $scope.u.cook_id = $cookieStore.get('cook_logged_in');
        $scope.u.food_id = food_details._id;
        $scope.u.files = $scope.imageData;
        console.log($scope.u);



        swal({
            title: "Are you sure?",
            text: "You Are Going To Update Food For Listing",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Go Ahead !",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    $http({
                        method: "POST",
                        url: "cook/update-food-details",
                        data: $scope.u

                    }).then(function mySucces(response) {

                        console.log(response);
                        $scope.food_details = "";
                        $scope.fetch_food_details();
                        swal("Updated", "Your Updated Food is Pending For Admin Approval :)", "success");
                        $scope.update_view_food_show = false;

                    }, function myError(response) {


                    });

                } else {
                    swal("Cancelled", "Your cancelled to Update Food :)", "error");
                }
            });




    }

    $scope.check_val_arr = function (v) {

        var len = $scope.check_for_update.occassion_list.length;
        console.log(len);

        for (var i = 0; i < len; i++) {

            if (v == $scope.check_for_update.occassion_list[i].group_attr) {

                return 'true';

            }
            else {

                return 'false';
            }

        }

    }


}]);


/************************************USER CONTROLLER*************************** */

app.controller('user_register', ['$scope', '$http', '$location', '$cookieStore', '$timeout', '$routeParams', '$base64', '$rootScope', 'cfpLoadingBar', 'Notification','$route','$localStorage', function ($scope, $http, $location, $cookieStore, $timeout, $routeParams, $base64, $rootScope, cfpLoadingBar, Notification,$route,$localStorage) {
    cfpLoadingBar.start();
    $scope.auth = function () {

        if ($cookieStore.get('s3cr3t_user') == undefined) {

            $location.path('/');
        } else {
            console.log('cookie found');

        }

    }

    $scope.get_user_lat_lon_detail = function () {

        $scope.u = {};
        $scope.u = $cookieStore.get('user_lat_long');
        console.log($scope.u);
    }

    $scope.login_check_for_login = function () {


        if ($cookieStore.get('s3cr3t_user') == undefined) {
            $location.path('/user_login');

        } else {
            $location.path('/my_profile_update');
        }
    }
    $scope.login_check_for_signup = function () {


        if ($cookieStore.get('s3cr3t_user') == undefined) {
            $location.path('/user_create');

        } else {
            $location.path('/my_profile_update');

        }
    }
    $scope.logout = function () {

        if ($cookieStore.get('s3cr3t_user') == undefined) {
            $location.path('/cook_login');

        } else {
            $cookieStore.remove("s3cr3t_user");
            $location.path('/');

        }
    };
    $scope.user_details = {};
    $scope.user_login = {};

    $scope.after_success_login_message = false;
    $scope.after_failed_login_message = false;
    $scope.already_register_user = false;
    $scope.add_user_details = function (user_details) {

        $scope.u = user_details;


        $http({
            method: "POST",
            url: "user/add-user-info",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response);
            $scope.user_details = "";
            $scope.after_success_reg_message = true;

            $timeout(function () {
                $scope.after_success_reg_message = false;

            }, 6000);



        }, function myError(response) {

            $scope.already_register_user = true;
            $timeout(function () {
                $scope.already_register_user = false;

            }, 4000);

        });

    }

    $scope.verify_user_params = function () {

        //    console.log('this is ID--'+$routeParams.user_id);

        $http({
            method: "GET",
            url: "user/user-verify/" + $routeParams.user_id

        }).then(function mySucces(response) {


            $cookieStore.put('s3cr3t_user', response.data._id);
            $location.path('/my_profile_update');
        }, function myError(response) {

            console.log(response);
        });

    }


    $scope.user_status = false;
    $scope.after_failed_activation = false;
    $scope.user_login_check = function (user_login) {

        $scope.u = user_login;


        console.log(user_login);


        $http({
            method: "POST",
            url: "user/user-login",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response.data);

            if (response.data == "user not found") {
                sweetAlert("Un Authorized", "Check credentials Again.", "error");
            }
            else if (response.data == "account disabled") {

                sweetAlert("Un Authorized", "Check credentials Again.", "error");
                $scope.user_status = true;

            }
            else {


                setTimeout(function () {
                    swal({
                        title: "Credentials Verified !",
                        text: "You Can Access Your Account Panel Now.",
                        type: "success",
                        confirmButtonText: "OK"
                    },
                        function (isConfirm) {
                            if (isConfirm) {

                                //$location.path('/cook_profile');
                                $scope.user_login = "";

                                $scope.after_success_login_message = true;
                                $cookieStore.put('s3cr3t_user', response.data[0]._id);
                                $cookieStore.put('s3cr3t_user_data', response.data);
                                window.location.href = "#/my_profile_update";
                            }
                        });
                }, 100);


            }
        }, function myError(err) {

            sweetAlert("Un Authorized", "Check credentials Again.", "error");
        });



    }
    $scope.user_password_update_detail = {};
    $scope.after_success_pass_update = false;
    $scope.after_failed_pass_update = false;

    $scope.user_password_update = function (pass_update_detail) {

        $scope.u = pass_update_detail;
        $scope.user_password_update_detail = "";
        $scope.u.user_id = $cookieStore.get('s3cr3t_user');
        console.log($scope.u);

        $http({
            method: "POST",
            url: "user/user-pass-update",
            data: $scope.u
        }).then(function mySucces(response) {


            $scope.after_success_pass_update = true;
            $timeout(function () {

                $scope.after_success_pass_update = false;

            }, 3000);

        }, function myError(response) {


            $scope.after_failed_pass_update = true;
            $timeout(function () {

                $scope.after_failed_pass_update = false;

            }, 3000);
        });
    };

    $scope.user_address_detail = {};

    $scope.update_user_address = function (address_details) {
        $scope.u = address_details;
        $scope.user_address_detail = "";
        $scope.u.user_id = $cookieStore.get('s3cr3t_user');

        $http({
            method: "POST",
            url: "user/user-address-add",
            data: $scope.u
        }).then(function mySucces(response) {

            $scope.getUserAddress();
            console.log('user address updating');
        }, function myError(response) {


        });


    }

    $scope.user_address_list = {};   // this variable is used to get/store user address

    $scope.getUserAddress = function () {

        $scope.user_id = { user_id: $cookieStore.get('s3cr3t_user') };
        // console.log($scope.user_id);
        $http({
            method: "POST",
            url: "user/get-user-address",
            data: $scope.user_id
        }).then(function mySucces(response) {

            $scope.user_address_list = response.data[0].address;
            console.log(response.data[0].address);
        }, function myError(response) {


        });

    }

    $scope.manage_account_update_user = {};
    $scope.manage_account_deactivate_user = {};
    $scope.after_success_account_update = false;
    $scope.after_success_account_deactivate = false;
    $scope.after_failed_account_deactivate = false;

    $scope.manage_account_user = function (acc_update_details) {
        $scope.u = $scope.manage_account_update_user;
        $scope.u.user_id = $cookieStore.get('s3cr3t_user');
        $scope.manage_account_update_user = "";

        $http({
            method: "POST",
            url: "user/user-account-update",
            data: $scope.u
        }).then(function mySucces(response) {


            $scope.after_success_account_update = true;
            $timeout(function () {

                $scope.after_success_account_update = false;

            }, 3000);

        }, function myError(response) {


        });
    }



    $scope.manage_account_user_deactivate = function (acc_update_details) {


        $scope.u = $scope.manage_account_deactivate_user;
        $scope.u.user_id = $cookieStore.get('s3cr3t_user');
        //  $scope.manage_account_update_user="";
        console.log($scope.u);
        $http({
            method: "POST",
            url: "user/user-account-deactivate",
            data: acc_update_details
        }).then(function mySucces(response) {
            $scope.manage_account_deactivate_user = "";

            $scope.after_success_account_deactivate = true;
            $timeout(function () {

                $scope.after_success_account_deactivate = false;
                $cookieStore.remove("s3cr3t_user");
                $location.path('/');
            }, 3000);

        }, function myError(response) {

            $scope.after_failed_account_deactivate = true;
            $timeout(function () {

                $scope.after_failed_account_deactivate = false;

            }, 3000);

        });
    }

    $scope.user_profile_update_data = {};
    $scope.user_profile_update_status = false;
    $scope.user_profile_update = function (user_profile_details) {

        if ($scope.imageData == "") {
            $scope.user_profile_update_data.user_profile_image = "";
            $scope.u = $scope.user_profile_update_data;
            $scope.u.user_id = $cookieStore.get('s3cr3t_user');

        }
        else {
            $scope.user_profile_update_data.user_profile_image = $scope.imageData;
            $scope.u = $scope.user_profile_update_data;
            $scope.u.user_id = $cookieStore.get('s3cr3t_user');

        }
        console.log($scope.u);
        $http({
            method: "POST",
            url: "user/user-profile-update",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response);
            //$scope.get_user_details();

            $scope.user_profile_update_status = true;
            $timeout(function () {

                $scope.user_profile_update_status = false;

            }, 3000);

        }, function myError(response) {


        });

    }

    $scope.isImage = function (ext) {
        if (ext) {
            return ext == "jpg" || ext == "jpeg" || ext == "gif" || ext == "png"
        }
    }
    $scope.imageData = "";
    $scope.upload_user_profile_image = function (files) {

        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('file').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            $scope.imageData = $base64.encode(data);

            //console.log($scope.imageData);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);

    }



    $scope.verify_otp_textbox = false;
    $scope.user_mobile_otp = "";
    $scope.verifyOTP = function () {
        $scope.verify_otp_textbox = true;

    }

    $scope.checkOTP = function () {
        console.log($scope.user_mobile_otp);
        if ($scope.user_mobile_otp == "1234") {
            console.log('sadfasdfdd');
            alert('OTP VERIFIED..!');
        }
        else if ($scope.user_mobile_otp != 1234 || $scope.user_mobile_otp != "") {
            alert('WRONG OTP..!');
        }
        else {

        }

    }

    $scope.user_profile_image_status = false;

    $scope.get_user_details = function () {
        $scope.user_id = {};

        $scope.user_id.user_id = $cookieStore.get('s3cr3t_user');

        $http({
            method: "POST",
            url: "user/get-user-details",
            data: $scope.user_id
        }).then(function mySucces(response) {

            $scope.user_profile_update_data = response.data;
            console.log(response.data);
        }, function myError(response) {


        });

    }

    $scope.forget_user_details = {};
    $scope.after_forget_mail_send = false;
    $scope.after_forget_mail_failed = false;
    $scope.get_user_password = function (forget_details) {


        $http({
            method: "POST",
            url: "user/forget-user-password",
            data: $scope.forget_user_details
        }).then(function mySucces(response) {


            $scope.forget_user_details = "";

            $scope.after_forget_mail_send = true;

            $timeout(function () {

                $scope.after_forget_mail_send = false;

            }, 4000);

        }, function myError(response) {


            $scope.after_forget_mail_failed = true;

            $timeout(function () {

                $scope.after_forget_mail_failed = false;

            }, 4000);

        });
    }

    //Deleting Address of user

    $scope.delete_address = function (address_id) {

        $scope.delete_add = {};
        $scope.delete_add.address_id = address_id;
        $scope.delete_add.user_id = $cookieStore.get('s3cr3t_user');
        $http({
            method: "POST",
            url: "user/delete-user-address",
            data: $scope.delete_add
        }).then(function mySucces(response) {

            $scope.getUserAddress();

        }, function myError(response) {



        });
    }



    $scope.food_listing = {};

    $scope.loc_val_cookies = function () {
        $scope.loc_show = $.cookie('eatoeato.loc');
    }

    $scope.show_listing_for_user = function () {

        $location.path('/listing');
    }
    $scope.loc_show = "";
    $scope.order = '-added';


  $scope.dd = {};
    $scope.get_foods_for_listing = function () {
        $scope.u = {};
        $scope.u = $cookieStore.get('user_lat_long');
        console.log($scope.u);

        $http({
            method: "POST",
            url: "user/get-listing-foods",
            data: $scope.u
        }).then(function mySucces(response) {

            //   $scope.cart_collection=$localStorage.cart_collection ;
            
            


            if($scope.cart_collection.length>0){

                for(var i=0;i<response.data.listing.length;i++){

                        for(var j=0;j<$scope.cart_collection.length;j++){

                                if(response.data.listing[i]._id==$scope.cart_collection[j].food_id){

                                        if($scope.cart_collection[j].order_date==$scope.dd.date){

                                            response.data.listing[i].cart_qty=$scope.cart_collection[j].food_qty;

                                        }

                                }


                        }
                        // if($scope.cart_collection[i].)

                }

            }

               console.log('THIS IS FINAL LISTING');
           console.log(response.data.listing);
            $scope.food_listing = response.data;


            $scope.food_listing.total_food_count = $scope.food_listing.listing.length;
            $scope.food_listing.filter_food_count = $scope.food_listing.listing.length;
            $scope.loc_show = $.cookie('eatoeato.loc');
            $scope.lat_long_coll = response.data.lat_long_coll;

            console.log($scope.food_listing);
            console.log($scope.loc_show);

            $scope.slider_translate.minValue = response.data.price_data.min_price;
            $scope.slider_translate.maxValue = response.data.price_data.max_price;
            $scope.slider_translate.options.ceil = response.data.price_data.max_price;
            $scope.slider_translate.options.floor = response.data.price_data.min_price;

            $scope.slider_translate_time.minTime = response.data.time_data.min_time;
            $scope.slider_translate_time.maxTime = response.data.time_data.max_time;
            $scope.slider_translate_time.options.ceil = response.data.time_data.max_time;
            $scope.slider_translate_time.options.floor = response.data.time_data.min_time;



            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (p) {

                    var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);


                    var mapOptions = {
                        center: LatLng,
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
                    var marker = new google.maps.Marker({
                        position: LatLng,
                        map: map,

                        title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
                    });




                    google.maps.event.addListener(marker, "click", function (e) {
                        var infoWindow = new google.maps.InfoWindow();
                        infoWindow.setContent(marker.title);
                        infoWindow.open(map, marker);
                    });

                    var markerB;
                    for (var i = 0; i < $scope.lat_long_coll.length; i++) {

                        markerB = new google.maps.Marker({
                            position: new google.maps.LatLng($scope.lat_long_coll[i].cook_latitude, $scope.lat_long_coll[i].cook_longitude),
                            map: map,
                            icon: 'http://192.168.1.157:3000/uploads/q.png'
                        });
                        //         latLngA = new google.maps.LatLng(parseInt($scope.lat_long_coll[i].cook_latitude),parseInt($scope.lat_long_coll[i].cook_longitude));

                        //                markerB = new google.maps.Marker({
                        //         position: latLngA,
                        //         title: 'Location',
                        //         map: map,


                        //     });

                        //                  google.maps.event.addListener(markerB, 'dragend', function() {
                        //     latLngA = new google.maps.LatLng(markerB.position.lat(), markerB.position.lng());

                        // });

                    }
                    var circle = new google.maps.Circle({
                        map: map,
                        radius: 2000,    // 10 miles in metres

                        fillColor: '#fff',
                        fillOpacity: .4,
                        strokeColor: '#313131',
                        strokeOpacity: .4,
                        strokeWeight: .8
                    });


                    circle.bindTo('center', marker, 'position');

                });
            } else {
                alert('Geo Location feature is not supported in this browser.');
            }



        }, function myError(response) {



        });

    }
    $scope.chaldo = function () {
        // $scope.food_listing.listing.filter(function(x){
        //     return 
        // });
        // console.log($scope.food_listing.listing);

        for (var i = 0; i < $scope.food_listing.listing.length; i++) {

            for (var j = 0; j < $scope.food_listing.listing[i].cuisine_list.length; j++) {

                if ($scope.food_listing.listing[i].cuisine_list[j].category_name != "category 1" && $scope.food_listing.listing[i].cuisine_list[i].category_name == "true") {

                }
                else {
                    $scope.food_listing.listing.splice(i, 1);
                    i--;
                    //  console.log($scope.food_listing.listing.length);
                }

            }


        }
        console.log($scope.food_listing.listing);
    }

    $scope.search = "";

    $scope.usePants = {};
    var vm = this;


    vm.onChangeFn = function (id, model) {

        console.log('this is price one');
    }
    $scope.slider_translate = {

        minValue: 100,
        maxValue: 400,
        options: {
            ceil: 500,
            floor: 100,

            translate: function (value) {

                return 'INR ' + value;
            }
        }
    };
    $scope.slider_translate_time = {

        minTime: 0,
        maxTime: 24,
        options: {
            ceil: 24,
            floor: 0,

            translate: function (value) {
                if (value >= 12) {

                    return value - 12 + ' PM... ';
                }
                if (value < 12) {

                    return value + ' AM... ';
                }
            }
        }
    };
    $scope.ps = [];
    $scope.price_data = {};
    $scope.ts = [];
    $scope.time_data = {}
    $scope.$on("slideEnded", function (val) {

        console.log(val);
        if (val.targetScope.slider.highValue <= 24) {

            $scope.time_data.min_time = val.targetScope.rzSliderModel;
            $scope.time_data.max_time = val.targetScope.rzSliderHigh;
            $scope.ts = $scope.time_data;
            console.log($scope.ts);
            $scope.toggleSelection_for_search($scope.ts);
        }
        else {
            $scope.price_data.min_price = val.targetScope.rzSliderModel;
            $scope.price_data.max_price = val.targetScope.rzSliderHigh;
            $scope.ps = $scope.price_data;
            console.log($scope.ps);
            $scope.toggleSelection_for_search($scope.ps);
        }

    });
    // selected checkebox for user/cooks
    $scope.selection_for_search = [];
  
            var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        var today = dd+'-'+mm+'-'+yyyy;

            $scope.dd.date = today;
    
    $scope.no_result_show = 'false';
    // toggle selection for a given cook/user by name
    $scope.toggleSelection_for_search = function (val) {

        console.log(val);

        if (val.group_attr) {
            $scope.selection_for_search.push(val);
            var arra = [];
            for (var i = 0; i < $scope.selection_for_search.length; i++) {
                if ($scope.selection_for_search[i].group_attr) {
                    arra.push(i);
                }
            }
            if (arra.length > 1) {
                $scope.selection_for_search.splice(arra[0], 1);
            }
        }

        if (val.category_name) {

            var idx = $scope.selection_for_search.indexOf(val);
            if (idx > -1) {
                $scope.selection_for_search.splice(idx, 1);

            }



            // is newly selected
            else {


                $scope.selection_for_search.push(val);


                // $scope.food_details.occassion_list = $scope.selection;
            }

        }
        if (val.veg_type) {

            $scope.selection_for_search.push(val);
            var arra = [];
            for (var i = 0; i < $scope.selection_for_search.length; i++) {
                if ($scope.selection_for_search[i].veg_type) {
                    arra.push(i);
                }
            }
            if (arra.length > 1) {
                $scope.selection_for_search.splice(arra[0], 1);
            }



        }
        // if (val.date) {

        //     console.log(' DATE IS CALLED');
        //     // $scope.selection_for_search.push(val);
        //     // var arra = [];
        //     // for (var i = 0; i < $scope.selection_for_search.length; i++) {
        //     //     if ($scope.selection_for_search[i].veg_type) {
        //     //         arra.push(i);
        //     //     }
        //     // }
        //     // if (arra.length > 1) {
        //     //     $scope.selection_for_search.splice(arra[0], 1);
        //     // }



        // }

        if (val.min_price || val.max_price) {

            $scope.selection_for_search.push(val);
            var arra = [];
            for (var i = 0; i < $scope.selection_for_search.length; i++) {
                if ($scope.selection_for_search[i].min_price) {
                    arra.push(i);
                }
            }
            if (arra.length > 1) {
                $scope.selection_for_search.splice(arra[0], 1);
            }
        }

        if (val.min_time || val.max_time) {

            $scope.selection_for_search.push(val);
            var arra = [];
            for (var i = 0; i < $scope.selection_for_search.length; i++) {
                if ($scope.selection_for_search[i].min_time) {
                    arra.push(i);
                }
            }
            if (arra.length > 1) {
                $scope.selection_for_search.splice(arra[0], 1);
            }
        }
        // $scope.selection_for_search.push(val);
        // for(var i=0;i<$scope.selection_for_search.length;i++){

        //     if($scope.selection_for_search[i].hasOwnProperty('group_attr')){
        //         $scope.selection_for_search.splice(i-1, 1);
        //     }
        // }
        //  //$scope.selection_for_search.push(val);
        // console.log($scope.selection_for_search);
        //  var idx = $scope.selection_for_search.indexOf(val);

        // // is currently selected
        console.log($scope.selection_for_search);

        $http({
            method: "POST",
            url: "user/filter-cook-listing",
            data: $scope.selection_for_search
        }).then(function mySucces(response) {

            if (response.data.length < 1) {
                $scope.get_foods_for_listing();
                $scope.no_result_show = 'true';
            }
            $scope.food_listing.listing = response.data;
            $scope.food_listing.filter_food_count = response.data.length;

            console.log(response.data);

        }, function myError(response) {



        });

    }

    $scope.toggleSelection_for_search_date=function(val){
    
         $scope.u = {};
        var lat_lon = $cookieStore.get('user_lat_long');
        $scope.u.lat=lat_lon.lat;
        $scope.u.long=lat_lon.long;
        $scope.u.date=val.date;
        console.log($scope.u);




        $http({
            method: "POST",
            url: "user/get-cook-listing-by-date",
            data:$scope.u
        }).then(function mySucces(response) {

            console.log('AFTER DATE CHANGE');
            console.log($localStorage.cart_collection );
               //  $scope.food_listing = response.data;
                         $scope.cart_collection=[];
                       $scope.cart_collection=$localStorage.cart_collection ;

                           if($scope.cart_collection.length){

                  for(var i=0;i<response.data.listing.length;i++){

                        for(var j=0;j<$scope.cart_collection.length;j++){

                                if(response.data.listing[i]._id==$scope.cart_collection[j].food_id){

                                        if($scope.cart_collection[j].order_date==$scope.dd.date){

                                            response.data.listing[i].cart_qty=$scope.cart_collection[j].food_qty;

                                        }

                                }


                        }
                        // if($scope.cart_collection[i].)

                }

            }

               console.log('THIS IS FINAL LISTING');
           console.log(response.data.listing);
            $scope.food_listing = response.data;


            $scope.food_listing.total_food_count = $scope.food_listing.listing.length;
            $scope.food_listing.filter_food_count = $scope.food_listing.listing.length;
            $scope.loc_show = $.cookie('eatoeato.loc');
            $scope.lat_long_coll = response.data.lat_long_coll;

            console.log('LISTING FOOD')
            console.log($scope.food_listing);
            console.log($scope.loc_show);

            $scope.slider_translate.minValue = response.data.price_data.min_price;
            $scope.slider_translate.maxValue = response.data.price_data.max_price;
            $scope.slider_translate.options.ceil = response.data.price_data.max_price;
            $scope.slider_translate.options.floor = response.data.price_data.min_price;

            $scope.slider_translate_time.minTime = response.data.time_data.min_time;
            $scope.slider_translate_time.maxTime = response.data.time_data.max_time;
            $scope.slider_translate_time.options.ceil = response.data.time_data.max_time;
            $scope.slider_translate_time.options.floor = response.data.time_data.min_time;



            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (p) {

                    var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);


                    var mapOptions = {
                        center: LatLng,
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
                    var marker = new google.maps.Marker({
                        position: LatLng,
                        map: map,

                        title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
                    });




                    google.maps.event.addListener(marker, "click", function (e) {
                        var infoWindow = new google.maps.InfoWindow();
                        infoWindow.setContent(marker.title);
                        infoWindow.open(map, marker);
                    });

                    var markerB;
                    for (var i = 0; i < $scope.lat_long_coll.length; i++) {

                        markerB = new google.maps.Marker({
                            position: new google.maps.LatLng($scope.lat_long_coll[i].cook_latitude, $scope.lat_long_coll[i].cook_longitude),
                            map: map,
                            icon: 'http://192.168.1.102:3000/uploads/q.png'
                        });
                        //         latLngA = new google.maps.LatLng(parseInt($scope.lat_long_coll[i].cook_latitude),parseInt($scope.lat_long_coll[i].cook_longitude));

                        //                markerB = new google.maps.Marker({
                        //         position: latLngA,
                        //         title: 'Location',
                        //         map: map,


                        //     });

                        //                  google.maps.event.addListener(markerB, 'dragend', function() {
                        //     latLngA = new google.maps.LatLng(markerB.position.lat(), markerB.position.lng());

                        // });

                    }
                    var circle = new google.maps.Circle({
                        map: map,
                        radius: 2000,    // 10 miles in metres

                        fillColor: '#fff',
                        fillOpacity: .4,
                        strokeColor: '#313131',
                        strokeOpacity: .4,
                        strokeWeight: .8
                    });


                    circle.bindTo('center', marker, 'position');

                });
            } else {
                alert('Geo Location feature is not supported in this browser.');
            }


            console.log(response);

        }, function myError(response) {



        });


    }

    $scope.reset_filters = function (al) {

        $scope.get_foods_for_listing();

    }

    // $scope.product.count=0;
    $scope.cart_collection = [];
    // $scope.cart_detail={};
    $scope.cart_total_item = "0";
    var item_total = 0;
    var ts = 0;


     $scope.increaseItemCount = function (item) {

        console.log('MY CAER');

        var flag = 0;


        for (var t = 0; t < $scope.food_listing.listing.length; t++) {

            if ($scope.food_listing.listing[t]._id == item._id) {

                if (item.cart_qty > parseInt($scope.food_listing.listing[t].food_max_qty) - 1) {

                    flag = 1;
                    Notification.error({ message: 'You Cannot Order this food ' + $scope.food_listing.listing[t].food_max_qty + ' Per Qty', delay: 3000 });
                    //  alert('You Cannot Order this food '+$scope.food_listing.listing[t].food_max_qty+' Per Qty')
                }

            }
        }

        if (flag == 1) {

             

            // alert('You Cannot Order this food'+$scope.food_listing.listing.food_max_qty+' Per Qty')
        }
        else {


            // console.log('THIS IS  ITEM');

            // console.log(item);
            


            var hasItem = "false";
            var len = $scope.cart_collection.length;
        
            if (ts == 0) {
                ts = parseInt(item.food_price_per_plate);
            }

            if (len < 1) {
                      item.cart_qty++;
                $scope.cart_detail = {};

                $scope.cart_detail.food_id = item._id;
                $scope.cart_detail.food_qty = item.cart_qty;
                $scope.cart_detail.food_price = item.food_price_per_plate;
                $scope.cart_detail.food_img = item.food_img_for_web;
                $scope.cart_detail.food_cuisine = item.cuisine_list;
                $scope.cart_detail.food_name = item.food_name;
                $scope.cart_detail.food_type = item.food_type;
                $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
                $scope.cart_detail.order_id=Math.floor(Date.now() / 1000),

                item.order_id=$scope.cart_detail.order_id,

                item.cart_qty= $scope.cart_detail.food_qty,

                $scope.cart_detail.order_date=$scope.dd.date,
                
                $scope.cart_collection.push($scope.cart_detail);
               


                console.log(item_total);
            }
            else {

                var  hasSameItemWithDiffDate=false;

                for (var i = 0; i < len; i++) {

                    if ($scope.cart_collection[i].food_id == item._id && $scope.cart_collection[i].order_id == item.order_id && $scope.cart_collection[i].order_date == $scope.dd.date) {
                      
                              item.cart_qty++;
                        hasItem = "true";
                        $scope.cart_collection[i].food_qty = item.cart_qty;
                        item_total = $scope.cart_collection[i].food_price * parseInt(item.cart_qty);
                        $scope.cart_collection[i].food_total_price = item_total;

                       
                    }

                    if ($scope.cart_collection[i].food_id == item._id && $scope.cart_collection[i].order_id == item.order_id && $scope.cart_collection[i].order_date != $scope.dd.date ) {
                           
                            hasItem = "true";
                            hasSameItemWithDiffDate=true;

                }
            }

                if (hasItem == "false") {
                          item.cart_qty++;
                    $scope.cart_detail = {};
                    $scope.cart_detail.food_id = item._id;
                    $scope.cart_detail.food_qty = item.cart_qty;
                    $scope.cart_detail.food_price = item.food_price_per_plate;
                    $scope.cart_detail.food_img = item.food_img_for_web;
                    $scope.cart_detail.food_cuisine = item.cuisine_list;
                    $scope.cart_detail.food_name = item.food_name;
                    $scope.cart_detail.food_total_price = 0;
                    $scope.cart_detail.food_type = item.food_type;
                    $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
                     $scope.cart_detail.order_id=Math.floor(Date.now() / 1000),
                    $scope.cart_detail.order_date=$scope.dd.date,

                    item.order_id=$scope.cart_detail.order_id

                    $scope.cart_collection.push($scope.cart_detail);
                   
                }

                 if (hasSameItemWithDiffDate ==true) {

                        console.log('THIS IS HAS SAME ITEM WIDH')   ;
                        console.log(item.cart_qty);
                     
                        item.cart_qty++;
                        $scope.cart_detail = {};
                        $scope.cart_detail.food_id =item._id;
                        $scope.cart_detail.food_qty = item.cart_qty;
                        $scope.cart_detail.food_price = item.food_price_per_plate;
                        $scope.cart_detail.food_img = item.food_img_for_web;
                        $scope.cart_detail.food_cuisine = item.cuisine_list;
                        $scope.cart_detail.food_name = item.food_name;
                        $scope.cart_detail.food_total_price = 0;
                        $scope.cart_detail.food_type = item.food_type;
                        $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
                        $scope.cart_detail.order_id=Math.floor(Date.now() / 1000),
                        $scope.cart_detail.order_date=$scope.dd.date,

                        item.order_id=$scope.cart_detail.order_id

                        $scope.cart_collection.push($scope.cart_detail);
                       

                         }
                   
            }

            $scope.cart_total_item = $scope.cart_collection.length;
         
            
                console.log($scope.cart_collection);
        
            Notification.warning({ message: 'Cart Updated..', delay: 1000 });

        }

              


    };
    $scope.decreaseItemCount = function (item) {

        console.log('DECREASE COUNT');
        console.log(item);

        if (item.cart_qty > 0) {
            item.cart_qty--;


            var len =  $scope.cart_collection;
            console.log($scope.cart_collection);
           /// $scope.cart_collection=$localStorage.cart_collection;
            for (var j = 0; j < len; j++) {


                if ($scope.cart_collection[j].food_id == item._id && $scope.cart_collection[j].order_id == item.order_id) {
                    if ($scope.cart_collection[j].food_qty > 0) {
                        $scope.cart_collection[j].food_qty = $scope.cart_collection[j].food_qty - 1;
                        item_total = $scope.cart_collection[j].food_price * parseInt($scope.cart_collection[j].food_qty);

                        console.log('THIS IS ITEM TOTAL');
                        console.log(item_total);
                    }
                    if ($scope.cart_collection[j].food_qty == 0) {

                        $scope.cart_collection.splice(j, 1);
                    }
                }
            }
            //     $scope.cart_collection.splice(i, 1);

            console.log(item.cart_qty);


        }
        $scope.cart_total_item = $scope.cart_collection.length;
        console.log('FFFFFINAL CAER COLLL');
       console.log($scope.cart_collection);
        delete $localStorage.cart_collection;

        $localStorage.cart_collection= $scope.cart_collection;
          console.log($localStorage.cart_collection);
       // $cookieStore.put('user_cart', $scope.cart_collection);
        Notification.info({ message: 'Cart Updated..', delay: 1000 });
    }



    // $scope.increaseItemCount = function (item) {
    //     console.log('MY CAER');
    //     console.log('THIS IS ITEM');
    //     console.log( $scope.dd.date);


        
    //    var len = $scope.cart_collection.length;
    //    console.log(len);
    //         if (len < 1) {
    //                   item.cart_qty++; 
    //             $scope.cart_detail = {};
    //             $scope.cart_detail.food_id = item._id;
    //             $scope.cart_detail.food_qty = item.cart_qty;
    //             $scope.cart_detail.food_price = item.food_price_per_plate;
    //             $scope.cart_detail.food_img = item.food_img_for_web;
    //             $scope.cart_detail.food_cuisine = item.cuisine_list;
    //             $scope.cart_detail.food_name = item.food_name;
    //             $scope.cart_detail.food_type = item.food_type;
    //             $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
    //             $scope.cart_detail.order_id=Math.floor(Date.now() / 1000)
    //                 $scope.cart_detail.order_date=$scope.dd.date;
    //             $scope.cart_collection.push($scope.cart_detail);
    //             console.log($scope.cart_collection);

    //              Notification.success({ message: 'Food Added Into Your Cart' , delay: 2000 });
    //             console.log(item_total);
    //         }
    //         else {
    //             var flag=0;
    //             var check=0;
    //             var same_food_diff_date=0;
    //             for (var i = 0; i < len; i++) {

    //                 if ($scope.cart_collection[i].food_id == item._id) {

    //                     if($scope.cart_collection[i].order_date==$scope.dd.date){
    //                         check=1;
    //                     }
                          
    //                        flag=1;
    //                     console.log(item_total);
    //                 }
                   
    //                 check==2;
             
    //             }

    //                  if(flag==1 && check==1){
    //                          Notification.error({ message: 'Already Added Into Cart' , delay: 2000 });
    //                  }


    //                   if(flag==0){

    //                                  item.cart_qty++; 
    //                 $scope.cart_detail = {};
    //                 $scope.cart_detail.food_id = item._id;
    //                 $scope.cart_detail.food_qty = item.cart_qty;
    //                 $scope.cart_detail.food_price = item.food_price_per_plate;
    //                 $scope.cart_detail.food_img = item.food_img_for_web;
    //                 $scope.cart_detail.food_cuisine = item.cuisine_list;
    //                 $scope.cart_detail.food_name = item.food_name;
    //                 $scope.cart_detail.food_type = item.food_type;
    //                 $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
    //                   $scope.cart_detail.order_id=Math.floor(Date.now() / 1000);
    //                   $scope.cart_detail.order_date=$scope.dd.date;
                      
    //                 $scope.cart_collection.push($scope.cart_detail);
    //                  console.log($scope.cart_collection);
    //                   console.log('THIS IA CCCCCC');
    //             Notification.success({ message: 'Food Added Into Your Cart' , delay: 2000 });
                



    //                   }

    //                   if(check==2){

    //                                  item.cart_qty++; 
    //                         $scope.cart_detail = {};
    //                 $scope.cart_detail.food_id = item._id;
    //                 $scope.cart_detail.food_qty = item.cart_qty;
    //                 $scope.cart_detail.food_price = item.food_price_per_plate;
    //                 $scope.cart_detail.food_img = item.food_img_for_web;
    //                 $scope.cart_detail.food_cuisine = item.cuisine_list;
    //                 $scope.cart_detail.food_name = item.food_name;
    //                 $scope.cart_detail.food_type = item.food_type;
    //                 $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
    //                   $scope.cart_detail.order_id=Math.floor(Date.now() / 1000);
    //                   $scope.cart_detail.order_date=$scope.dd.date;
                      
    //                 $scope.cart_collection.push($scope.cart_detail);
    //                  console.log($scope.cart_collection);
    //                  console.log('THIS IA AAAAAA');
    //             Notification.success({ message: 'Food Added Into Your Cart' , delay: 2000 });
                



    //                   }
                      

    //                    if(check==0){
                           
    //                        console.log('THIS IS BBBBBBB');
    //                                  item.cart_qty++; 
    //                         $scope.cart_detail = {};
    //                 $scope.cart_detail.food_id = item._id;
    //                 $scope.cart_detail.food_qty = item.cart_qty;
    //                 $scope.cart_detail.food_price = item.food_price_per_plate;
    //                 $scope.cart_detail.food_img = item.food_img_for_web;
    //                 $scope.cart_detail.food_cuisine = item.cuisine_list;
    //                 $scope.cart_detail.food_name = item.food_name;
    //                 $scope.cart_detail.food_type = item.food_type;
    //                 $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
    //                   $scope.cart_detail.order_id=Math.floor(Date.now() / 1000);
    //                   $scope.cart_detail.order_date=$scope.dd.date;
                      
    //                 $scope.cart_collection.push($scope.cart_detail);
    //                 console.log('THISI SI CARR COLLLLLLL');
    //                  console.log($scope.cart_collection);
    //             Notification.success({ message: 'Food Added Into Your Cart' , delay: 2000 });
                



    //                   }
                      
                      
                 
    //         }

    //            console.log('THIS IS FINAL CART COLL');
    //                  console.log($scope.cart_collection);

    //  $scope.cart_total_item = $scope.cart_collection.length;
    //         $cookieStore.put('user_cart', $scope.cart_collection);

    //     // var flag = 0;


    //     // for (var t = 0; t < $scope.food_listing.listing.length; t++) {

    //     //     if ($scope.food_listing.listing[t]._id == item._id) {

    //     //         if (item.cart_qty > parseInt($scope.food_listing.listing[t].food_max_qty) - 1) {

    //     //             flag = 1;
    //     //             Notification.error({ message: 'You Cannot Order this food ' + $scope.food_listing.listing[t].food_max_qty + ' Per Qty', delay: 3000 });
    //     //             //  alert('You Cannot Order this food '+$scope.food_listing.listing[t].food_max_qty+' Per Qty')
    //     //         }

    //     //     }
    //     // }

    //     // if (flag == 1) {

    //     //     // alert('You Cannot Order this food'+$scope.food_listing.listing.food_max_qty+' Per Qty')
    //     // }
    //     // else {


    //     //     item.cart_qty++;

    //     //     console.log(item);

    //     //     var hasItem = "false";
    //     //     var len = $scope.cart_collection.length;
    //     //     console.log(len);
    //     //     if (ts == 0) {
    //     //         ts = parseInt(item.food_price_per_plate);
    //     //     }

    //     //     if (len < 1) {

    //     //         $scope.cart_detail = {};
    //     //         $scope.cart_detail.food_id = item._id;
    //     //         $scope.cart_detail.food_qty = item.cart_qty;
    //     //         $scope.cart_detail.food_price = item.food_price_per_plate;
    //     //         $scope.cart_detail.food_img = item.food_img_for_web;
    //     //         $scope.cart_detail.food_cuisine = item.cuisine_list;
    //     //         $scope.cart_detail.food_name = item.food_name;
    //     //         $scope.cart_detail.food_type = item.food_type;
    //     //         $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
    //     //         $scope.cart_collection.push($scope.cart_detail);
    //     //         console.log($scope.cart_collection);


    //     //         console.log(item_total);
    //     //     }
    //     //     else {
    //     //         for (var i = 0; i < len; i++) {

    //     //             if ($scope.cart_collection[i].food_id == item._id) {

    //     //                 hasItem = "true";
    //     //                 $scope.cart_collection[i].food_qty = item.cart_qty;
    //     //                 item_total = $scope.cart_collection[i].food_price * parseInt(item.cart_qty);
    //     //                 $scope.cart_collection[i].food_total_price = item_total;

    //     //                 console.log(item_total);
    //     //             }

    //     //         }

    //     //         if (hasItem == "false") {
    //     //             $scope.cart_detail = {};
    //     //             $scope.cart_detail.food_id = item._id;
    //     //             $scope.cart_detail.food_qty = item.cart_qty;
    //     //             $scope.cart_detail.food_price = item.food_price_per_plate;
    //     //             $scope.cart_detail.food_img = item.food_img_for_web;
    //     //             $scope.cart_detail.food_cuisine = item.cuisine_list;
    //     //             $scope.cart_detail.food_name = item.food_name;
    //     //             $scope.cart_detail.food_total_price = 0;
    //     //             $scope.cart_detail.food_type = item.food_type;
    //     //             $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
    //     //             $scope.cart_collection.push($scope.cart_detail);
    //     //         }
    //     //     }

    //     //     $scope.cart_total_item = $scope.cart_collection.length;
    //     //     $cookieStore.put('user_cart', $scope.cart_collection);
    //     //     console.log('THISIS CART');
    //     //     console.log($scope.cart_collection.length);

    //     //     Notification.warning({ message: 'Cart Updated..', delay: 1000 });

    //     // }


    // };

    $scope.add_to_cart_to_detail_page=function(item,key,food_id,cuisines){

        
        if($('#'+key+food_id).val()==""){

             Notification.warning({ message: 'Please Select Date First', delay: 1000 });
        }
        else{

        console.log('THIS IS CUISINE');
        console.log(cuisines[0].food_cuisine);
        if($scope.isAvailFood==true){
            console.log('IT IS AVAILABLE');



        var len = $scope.cart_collection.length;
       console.log(len);
            if (len < 1) {
                      item.cart_qty++; 
                $scope.cart_detail = {};
                $scope.cart_detail.food_id = food_id;
                $scope.cart_detail.food_qty = item.cart_qty;
                $scope.cart_detail.food_price = item.food_price_per_plate;
                $scope.cart_detail.food_img = item.food_img_for_web;
                $scope.cart_detail.food_cuisine = cuisines[0].food_cuisine;
                $scope.cart_detail.food_name = item.food_name;
                $scope.cart_detail.food_type = item.food_type;
                $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
                $scope.cart_detail.order_id=Math.floor(Date.now() / 1000)
                $scope.cart_detail.order_date=$scope.isAvailFoodDate;
                $scope.cart_collection.push($scope.cart_detail);
                console.log($scope.cart_collection);

                 Notification.success({ message: 'Food Added Into Your Cart' , delay: 2000 });
                console.log(item_total);
            }
            else {
                var flag=0;
                var check=0;
                var check_temp=0;
                for (var i = 0; i < len; i++) {

                    if ($scope.cart_collection[i].food_id == food_id) {

                        if($scope.cart_collection[i].order_date==$scope.isAvailFoodDate){
                            check=1;
                            check_temp=1;
                        }
                           Notification.error({ message: 'Already Added Into Cart' , delay: 2000 });
                           flag=1;
                        console.log(item_total);
                    }
             
                }
                      if(flag==0){

                                     item.cart_qty++; 
                            $scope.cart_detail = {};
                    $scope.cart_detail.food_id = food_id;
                    $scope.cart_detail.food_qty = item.cart_qty;
                    $scope.cart_detail.food_price = item.food_price_per_plate;
                    $scope.cart_detail.food_img = item.food_img_for_web;
                    $scope.cart_detail.food_cuisine = cuisines[0].food_cuisine;
                    $scope.cart_detail.food_name = item.food_name;
                    $scope.cart_detail.food_type = item.food_type;
                    $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
                      $scope.cart_detail.order_id=Math.floor(Date.now() / 1000);
                      $scope.cart_detail.order_date=$scope.isAvailFoodDate;
                      
                    $scope.cart_collection.push($scope.cart_detail);
                   
                Notification.success({ message: 'Food Added Into Your Cart' , delay: 2000 });
                



                      }

                      if(check==0){

                                      item.cart_qty++; 
                            $scope.cart_detail = {};
                    $scope.cart_detail.food_id = food_id;
                    $scope.cart_detail.food_qty = item.cart_qty;
                    $scope.cart_detail.food_price = item.food_price_per_plate;
                    $scope.cart_detail.food_img = item.food_img_for_web;
                    $scope.cart_detail.food_cuisine = cuisines[0].food_cuisine;
                    $scope.cart_detail.food_name = item.food_name;
                    $scope.cart_detail.food_type = item.food_type;
                    $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
                      $scope.cart_detail.order_id=Math.floor(Date.now() / 1000);
                      $scope.cart_detail.order_date=$scope.isAvailFoodDate;
                      
                    $scope.cart_collection.push($scope.cart_detail);
                     console.log($scope.cart_collection);
                Notification.success({ message: 'Food Added Into Your Cart' , delay: 2000 });
                



                      }
                 
            }
     $scope.cart_total_item = $scope.cart_collection.length;
            $cookieStore.put('user_cart', $scope.cart_collection);



       }

         if($scope.isAvailFood==false){
            console.log('IT IS NOT AVAILABLE');
              Notification.error({ message: 'Not Available. Change Date To check Availablity' , delay: 2000 });
       }     

    }
}

$scope.isAvailFood=false;
$scope.isAvailFoodDate="";
    $scope.check_food_avail=function(data,key,food_id){

              var incoming_date,date_frm,date_to;
                var dta=key+food_id;
                
                console.log(data);

                incoming_date=$('#'+dta).val();
                date_frm=data.selected_date_from;
                date_to=data.selected_date_to;


                        var dateFrom = date_frm;
                        var dateTo = date_to;
                        var dateCheck = incoming_date;

                        var d1 = dateFrom.split("-");
                        var d2 = dateTo.split("-");
                        var c = dateCheck.split("-");

                        var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
                        var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
                        var check = new Date(c[2], parseInt(c[1])-1, c[0]);

var res=check > from && check < to;
$scope.isAvailFood=res;

        if(res==true){

            Notification.info({ message: 'Food Available', delay: 1000 });
            $scope.isAvailFoodDate=incoming_date;
        }
        if(res==false){

            Notification.error({ message: 'Food Not Available', delay: 1000 });
        }
console.log(res);


    }

    // $scope.decreaseItemCount = function (item) {

    //     if (item.cart_qty > 0) {
    //         item.cart_qty--;


    //         var len = $scope.cart_collection.length;
    //         console.log(len);

    //         for (var j = 0; j < len; j++) {


    //             if ($scope.cart_collection[j].food_id == item._id) {
    //                 if ($scope.cart_collection[j].food_qty > 0) {
    //                     $scope.cart_collection[j].food_qty = $scope.cart_collection[j].food_qty - 1;
    //                     item_total = $scope.cart_collection[j].food_price * parseInt($scope.cart_collection[j].food_qty);


    //                     console.log(item_total);
    //                 }
    //                 if ($scope.cart_collection[j].food_qty == 0) {

    //                     $scope.cart_collection.splice(j, 1);
    //                 }
    //             }
    //         }
    //         //     $scope.cart_collection.splice(i, 1);

    //         console.log(item.cart_qty);


    //     }
    //     $scope.cart_total_item = $scope.cart_collection.length;
    //     $cookieStore.put('user_cart', $scope.cart_collection);
    //     Notification.info({ message: 'Cart Updated..', delay: 1000 });
    // }



    $scope.saveCart = function () {
    
    //delete $localStorage.cart_collection;
        var coll=[];
        coll=$scope.cart_collection;
      
            $localStorage.cart_collection = $scope.cart_collection; 
         console.log( $cookieStore.get('user_cart'));
       $location.path('/cart');
    }

    $scope.view_cart_val = {};
    $scope.manage_cart_total = {};
    $scope.delivery_charge = 30;

    $scope.manage_cart_total = {};
    $scope.delivery_charge = 30;
    $scope.cart_data_obj = {};

    $scope.fetch_cart = function () {

        console.log('FETCHING CART GGGGGGGG');
        console.log($localStorage.cart_collection);
        // delete $localStorage.cart_collection;
        //   console.log($localStorage.cart_collection);
        if ($localStorage.cart_collection == undefined) {

        }
        else if ($localStorage.cart_collection != undefined) {
        
            $scope.view_cart_val = $localStorage.cart_collection;

            $scope.cart_total_item = $scope.view_cart_val.length;

            $scope.manage_cart_total.total_item = $scope.view_cart_val.length;

            var tot = 0;
            for (var i = 0; i < $scope.view_cart_val.length; i++) {

                if (i == 0) {
                    tot = tot + $scope.view_cart_val[i].food_total_price;
                }
                else {
                    $scope.delivery_charge = $scope.delivery_charge + 30;
                    tot = tot + $scope.view_cart_val[i].food_total_price;
                }

            }
            $scope.manage_cart_total.total_price = tot;
            $scope.manage_cart_total.total_price_final = tot + 30;



            $scope.cart_collection = $cookieStore.get('user_cart');
            $scope.cart_data_obj = $scope.cart_collection;
            console.log('FETCHING CART');

        }

    }
    $scope.place_order = function () {

        $cookieStore.put('check_out_coll', $scope.view_cart_val);
        console.log($cookieStore.get('check_out_coll'));
    }

    $scope.checkout_cart_view = {};
    $scope.price_data = {};
    // THIS FUNCTINO LOADS WHEN CHECKOUT PAGE LOADS
    $scope.fetch_cart_coll = function () {

        var cart_coll = [];
        var total_price = 0;
        var grand_total = 0;
        var item_len = 0;

        cart_coll = $cookieStore.get('check_out_coll');

        for (var i = 0; i < cart_coll.length; i++) {

            cart_coll[i].food_total_price = cart_coll[i].food_price * cart_coll[i].food_qty;
            total_price = total_price + cart_coll[i].food_total_price;

            item_len++;
        }



        $scope.checkout_cart_view = cart_coll;
        $scope.price_data.total_price = total_price;
        $scope.price_data.grand_total = total_price + 30;
        $scope.price_data.total_items = item_len;


        console.log($scope.checkout_cart_view);
        console.log($scope.price_data);

    }


    $scope.view_cuisine_details_user = {};
    $scope.fetch_all_cuisine = function () {

        $http({
            method: "GET",
            url: "admin/fetch-all-cuisines",

        }).then(function mySucces(response) {

            console.log('CUISINES');
            $scope.view_cuisine_details_user = response.data;
            //     console.log( $scope.view_delivery_boy);
            console.log(response.data);
        }, function myError(response) {
            console.log('err');
        });

    }


    // BANNER DISPLAY

    $scope.listing_promo_2_detail = {};
    $scope.listing_background_img = {};

    $scope.fetch_listing_promotional_banner = function () {
        console.log('ANKUR GUPTA')
        $http({
            method: "GET",
            url: "admin/get-listing-promotional-banner",


        }).then(function mySucces(response) {

            //   $scope.view_food_details = response.data;

            //   $scope.view_food_details=
            $scope.listing_promo_2_detail = response.data[1].list_promo_bann.assined_banner_name.banner_details;
            $scope.listing_background_img = response.data[0].list_background_img.assined_banner_name.banner_details;
            console.log(response.data);


        }, function myError(response) {


        });

    }


    // TILL BANNER DISPLAY

    // FOR CART FUNCTIONALITY ADD AND UPDATE CART IN CART PAGES

    //  $scope.cart_collection = [];
    //     // $scope.cart_detail={};
    //     $scope.cart_total_item = "0";
    //     var item_total = 0;
    //     var ts=0;
    $scope.increaseItemCount_for_cart_page = function (item) {

        console.log('this is INCREASED ITEM');
        console.log(item);

        if (item.food_qty == 0) {


            $scope.manage_cart_total.total_item = $scope.manage_cart_total.total_item + 1;
            $scope.delivery_charge = $scope.delivery_charge + 30;
        }
        item.food_qty++;
        var base_price = parseInt(item.food_price);
        console.log('BASE PRICE' + base_price);
        console.log($scope.manage_cart_total);
        var sub_tot_price = base_price * item.food_qty;
        item.food_total_price = sub_tot_price;

        $scope.manage_cart_total.total_price = $scope.manage_cart_total.total_price + base_price;
        $scope.manage_cart_total.total_price_final = $scope.manage_cart_total.total_price + 30;

        for (var i = 0; i < $scope.view_cart_val.length; i++) {

            if ($scope.view_cart_val[i].food_id == item.food_id) {

                $scope.view_cart_val[i].food_qty == item.food_qty;
            }

        }




    };
    $scope.decreaseItemCount_for_cart_page = function (item) {

        if (item.food_qty > 0) {
            item.food_qty--;
            console.log(item);
            var base_price = parseInt(item.food_price);
            //     console.log('BASE PRICE'+base_price);
            //     console.log($scope.manage_cart_total); 
            var sub_tot_price = base_price * item.food_qty;
            item.food_total_price = sub_tot_price;

            $scope.manage_cart_total.total_price = $scope.manage_cart_total.total_price - base_price;

            if (item.food_total_price == 0) {
                $scope.manage_cart_total.total_item = $scope.manage_cart_total.total_item - 1;
                $scope.manage_cart_total.total_price_final = $scope.manage_cart_total.total_price;
                $scope.delivery_charge = $scope.delivery_charge - 30;
            }
            else {
                $scope.manage_cart_total.total_price_final = $scope.manage_cart_total.total_price + 30;

            }


            for (var i = 0; i < $scope.view_cart_val.length; i++) {

                if ($scope.view_cart_val[i].food_id == item.food_id) {

                    $scope.view_cart_val[i].food_qty == item.food_qty;
                }

            }


        }

    }

    $scope.remove_item_from_cart = function (food_id) {

        var cart =  $localStorage.cart_collection ;
        var len = cart.length;
        for (var i = 0; i < len; i++) {

            if ($scope.view_cart_val[i].food_id == food_id) {
                console.log($scope.view_cart_val);
                $scope.view_cart_val.splice(i, 1);
                $cookieStore.put('user_cart', $scope.view_cart_val);
                $scope.fetch_cart();

            }

        }
        console.log($cookieStore.get('user_cart'));
        if ($cookieStore.get('user_cart').length == 0) {
            $scope.manage_cart_total.total_price_final = 0;
        }

    }

    // FOR CART FUNCTIONALITY ADD AND UPDATE CART IN CART PAGES


    $scope.toggleSelection_for_serach_radio = function (val) {

        var len = $scope.selection_for_search.length;
        console.log(len);
        for (var i = 0; i < len; i++) {

            if ($scope.selection_for_search[i].hasOwnProperty("group_attr")) {
                $scope.selection_for_search.splice(i, 1);

                console.log($scope.selection_for_search);
                break;
            }
            else {
                $scope.selection_for_search.push(val);
                console.log($scope.selection_for_search);
            }
        }



    }

    $scope.capture_food_id_temp = function (event, food_id) {

        console.log(food_id);


        $cookieStore.put('food_id', food_id);
    }


    // CART FUNCTIONING FOR DETAIL PAGE

    $scope.increaseItemCount_detail = function (item) {
        console.log('MY CAER');

      

        console.log($scope.menu_view);
        var flag = 0;
        var key = [];
        key=Object.keys($scope.menu_view[0]);
          console.log(key);
        var dd = $scope.menu_view[0][key[0]];
     //   console.log(dd);
        for(var m=0;m<$scope.menu_view.length;m++){

                key=Object.keys($scope.menu_view[m]);
         

                for(var n=0;n<$scope.menu_view[m][key[0]].length;n++){

                      if(item.cart_qty>parseInt($scope.menu_view[m][key[0]][n].food_max_qty)-1){

                            flag=1;
                             Notification.error({ message: 'You Cannot Order this food '+$scope.menu_view[m][key[0]][n].food_max_qty+' Per Qty', delay: 3000 });
                    }
                        // console.log($scope.menu_view[m][key[0]][n].food_max_qty);

                }

        }

        if(flag==0){


            item.cart_qty++;

            console.log(item);

            var hasItem = "false";
            var len = $scope.cart_collection.length;
            console.log(len);
            if (ts == 0) {
                ts = parseInt(item.food_price_per_plate);
            }

            if (len < 1) {

                $scope.cart_detail = {};
                $scope.cart_detail.food_id = item._id;
                $scope.cart_detail.food_qty = item.cart_qty;
                $scope.cart_detail.food_price = item.food_price_per_plate;
                $scope.cart_detail.food_img = item.food_img_for_web;
                $scope.cart_detail.food_cuisine = item.cuisine_list;
                $scope.cart_detail.food_name = item.food_name;
                $scope.cart_detail.food_type = item.food_type;
                $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
                $scope.cart_collection.push($scope.cart_detail);
                console.log($scope.cart_collection);


                console.log(item_total);
            }
            else {
                for (var i = 0; i < len; i++) {

                    if ($scope.cart_collection[i].food_id == item._id) {

                        hasItem = "true";
                        $scope.cart_collection[i].food_qty = item.cart_qty;
                        item_total = $scope.cart_collection[i].food_price * parseInt(item.cart_qty);
                        $scope.cart_collection[i].food_total_price = item_total;

                        console.log(item_total);
                    }

                }

                if (hasItem == "false") {
                    $scope.cart_detail = {};
                    $scope.cart_detail.food_id = item._id;
                    $scope.cart_detail.food_qty = item.cart_qty;
                    $scope.cart_detail.food_price = item.food_price_per_plate;
                    $scope.cart_detail.food_img = item.food_img_for_web;
                    $scope.cart_detail.food_cuisine = item.cuisine_list;
                    $scope.cart_detail.food_name = item.food_name;
                    $scope.cart_detail.food_total_price = 0;
                    $scope.cart_detail.food_type = item.food_type;
                    $scope.cart_detail.food_total_price = parseInt(item.food_price_per_plate);
                    $scope.cart_collection.push($scope.cart_detail);
                }
            }

            $scope.cart_total_item = $scope.cart_collection.length;
            $cookieStore.put('user_cart', $scope.cart_collection);
            console.log('THISIS CART');
            console.log($scope.cart_collection.length);

            Notification.warning({ message: 'Cart Updated..', delay: 1000 });



        }

        //         for(var t=0;t<$scope.food_listing.listing.length;t++){

        //             if($scope.food_listing.listing[t]._id==item._id){

        //                     if(item.cart_qty>parseInt($scope.food_listing.listing[t].food_max_qty)-1){

        //                             flag=1;
        //                             Notification.error({ message: 'You Cannot Order this food '+$scope.food_listing.listing[t].food_max_qty+' Per Qty', delay: 3000 });
        //                             //  alert('You Cannot Order this food '+$scope.food_listing.listing[t].food_max_qty+' Per Qty')
        //                     }

        //             }
        //         }

        //     if(flag==1){

        //         // alert('You Cannot Order this food'+$scope.food_listing.listing.food_max_qty+' Per Qty')
        //     }
        //     else{


     

    };
    $scope.decreaseItemCount_detail = function (item) {

        if (item.cart_qty > 0) {
            item.cart_qty--;


            var len = $scope.cart_collection.length;
            console.log(len);

            for (var j = 0; j < len; j++) {


                if ($scope.cart_collection[j].food_id == item._id) {
                    if ($scope.cart_collection[j].food_qty > 0) {
                        $scope.cart_collection[j].food_qty = $scope.cart_collection[j].food_qty - 1;
                        item_total = $scope.cart_collection[j].food_price * parseInt($scope.cart_collection[j].food_qty);


                        console.log(item_total);
                    }
                    if ($scope.cart_collection[j].food_qty == 0) {

                        $scope.cart_collection.splice(j, 1);
                    }
                }
            }
            //     $scope.cart_collection.splice(i, 1);

            console.log(item.cart_qty);


        }
        $scope.cart_total_item = $scope.cart_collection.length;
        $cookieStore.put('user_cart', $scope.cart_collection);
        Notification.info({ message: 'Cart Updated..', delay: 1000 });
    }

    // CART FUNCTIONING FOR DETAIL PAGE


    $scope.fetched_food_view = {};
    $scope.menu_view = [];
    $scope.day = [];
    $scope.day_obj = {};
    $scope.captured_food_id_fetch = function () {


        $scope.u = {};
        $scope.u.food_id = $cookieStore.get('food_id');


        $http({
            method: "POST",
            url: "user/fetch-food-by-id",
            data: $scope.u
        }).then(function mySucces(response) {


            $scope.fetched_food_view = response.data.food;

            console.log($scope.fetched_food_view);

            var m_arr = [];


            var m_len = Object.keys(response.data.menu_details).length;

            for (var item in Object.keys(response.data.menu_details)) {
                let val = Object.keys(response.data.menu_details)[item];
                console.log(val);
                var temp = {};
                temp[val] = response.data.menu_details[val];
                m_arr.push(temp);

                // m_obj={};
                // m_obj.food=response.data.menu_details.Object.keys( response.data.menu_details)[m];
                // $scope.menu_view.push(m_obj);
            }
            console.log(m_arr);
            //   $scope.menu_view.push(response.data.menu_details);
            //   console.log( Object.keys( response.data.menu_details));
            $scope.menu_view = m_arr;


            var minutes = 1000 * 60;
            var hours = minutes * 60;

            var d = new Date();
            var curr_hour = d.getHours();
            var curr_day = d.getUTCDate();
            //var curr_day=d.getDay();
            var ampm = (curr_hour >= 12) ? "PM" : "AM";
            var curr_day_for_match = d.toString().toLowerCase().substring(0, 3);
            var tmp_day;
            //Object.keys(response.data.available_hours)[0].substring(0,3)
            //if($scope.fetched_food_view.available_hours.)
            console.log('CURRENT HOURS');
            console.log(curr_hour);

            // console.log( Object.keys(response.data.available_hours)[0].substring(0,3));
            console.log(ampm);

            console.log(curr_day_for_match);

            console.log('MON FROM VAffffffLUE-' + parseInt(response.data.food.available_hours.mon_from.substr(0, 2)));
            console.log('MON FROM AMPM-' + response.data.food.available_hours.mon_from.substr(response.data.food.available_hours.mon_from.length - 2));
            console.log('MON TO VALUE-' + parseInt(response.data.food.available_hours.mon_to.substr(0, 2)));
            console.log('MON TO AMPM-' + response.data.food.available_hours.mon_to.substr(response.data.food.available_hours.mon_to.length - 2));
            var time_frm, time_to;
            if ('mon' === curr_day_for_match) {

                console.log('ITS MON');
                if (response.data.food.available_hours.mon_from.substr(response.data.food.available_hours.mon_from.length - 2) == 'PM') {
                    time_frm = parseInt(response.data.food.available_hours.mon_from.substr(0, 2)) + 12;
                }
                else {
                    time_frm = parseInt(response.data.food.available_hours.mon_from.substr(0, 2));
                }


                if (response.data.food.available_hours.mon_to.substr(response.data.food.available_hours.mon_to.length - 2) == 'PM') {

                    time_to = parseInt(response.data.food.available_hours.mon_to.substr(0, 2)) + 12;
                }
                else {

                    time_to = parseInt(response.data.food.available_hours.mon_to.substr(0, 2));

                }

                if (time_frm <= curr_hour && time_to >= curr_hour) {

                    console.log("range in betweeen");
                }
                else {
                    console.log("range not in betweeen");


                    var src = $("#avail_status").attr('src').replace("public/images/icon/online.png", "public/images/icon/offline.png");
                    $("#avail_status").attr('src', src);

                }


            }
            if ('tue' === curr_day_for_match) {

                console.log('ITS TUESDAY');



                if (response.data.food.available_hours.tue_from.substr(response.data.food.available_hours.tue_from.length - 2) == 'PM') {
                    time_frm = parseInt(response.data.food.available_hours.tue_from.substr(0, 2)) + 12;
                }
                else {
                    time_frm = parseInt(response.data.food.available_hours.tue_from.substr(0, 2));
                }


                if (response.data.food.available_hours.tue_to.substr(response.data.food.available_hours.tue_to.length - 2) == 'PM') {

                    time_to = parseInt(response.data.food.available_hours.tue_to.substr(0, 2)) + 12;
                }
                else {

                    time_to = parseInt(response.data.food.available_hours.tue_to.substr(0, 2));

                }

                if (time_frm <= curr_hour && time_to >= curr_hour) {

                    console.log("range in betweeen TUESDAY");
                }
                else {
                    console.log("range not in betweeen TUESDAY");
                    var src = $("#avail_status").attr('src').replace("public/images/icon/online.png", "public/images/icon/offline.png");
                    $("#avail_status").attr('src', src);

                }

            }
            if ('wed' === curr_day_for_match) {

                console.log('ITS WED');



                if (response.data.food.available_hours.wed_from.substr(response.data.food.available_hours.wed_from.length - 2) == 'PM') {
                    time_frm = parseInt(response.data.food.available_hours.wed_from.substr(0, 2)) + 12;
                }
                else {
                    time_frm = parseInt(response.data.food.available_hours.wed_from.substr(0, 2));
                }


                if (response.data.food.available_hours.wed_to.substr(response.data.food.available_hours.wed_to.length - 2) == 'PM') {

                    time_to = parseInt(response.data.food.available_hours.wed_to.substr(0, 2)) + 12;
                }
                else {

                    time_to = parseInt(response.data.food.available_hours.wed_to.substr(0, 2));

                }

                if (time_frm <= curr_hour && time_to >= curr_hour) {

                    console.log("range in betweeen WED");
                }
                else {
                    console.log("range not in betweeen WED");
                    var src = $("#avail_status").attr('src').replace("public/images/icon/online.png", "public/images/icon/offline.png");
                    $("#avail_status").attr('src', src);

                }

            }
            if ('thu' === curr_day_for_match) {

                console.log('ITS THU');



                if (response.data.food.available_hours.thu_from.substr(response.data.food.available_hours.thu_from.length - 2) == 'PM') {
                    time_frm = parseInt(response.data.food.available_hours.thu_from.substr(0, 2)) + 12;
                }
                else {
                    time_frm = parseInt(response.data.food.available_hours.thu_from.substr(0, 2));
                }


                if (response.data.food.available_hours.thu_to.substr(response.data.food.available_hours.thu_to.length - 2) == 'PM') {

                    time_to = parseInt(response.data.food.available_hours.thu_to.substr(0, 2)) + 12;
                }
                else {

                    time_to = parseInt(response.data.food.available_hours.thu_to.substr(0, 2));

                }

                if (time_frm <= curr_hour && time_to >= curr_hour) {

                    console.log("range in betweeen THU");
                }
                else {
                    console.log("range not in betweeen THU");
                    var src = $("#avail_status").attr('src').replace("public/images/icon/online.png", "public/images/icon/offline.png");
                    $("#avail_status").attr('src', src);

                }

            }
            if ('fri' === curr_day_for_match) {

                console.log('ITS FRI');



                if (response.data.food.available_hours.fri_from.substr(response.data.food.available_hours.fri_from.length - 2) == 'PM') {
                    time_frm = parseInt(response.data.food.available_hours.fri_from.substr(0, 2)) + 12;
                }
                else {
                    time_frm = parseInt(response.data.food.available_hours.fri_from.substr(0, 2));
                }


                if (response.data.food.available_hours.fri_to.substr(response.data.food.available_hours.fri_to.length - 2) == 'PM') {

                    time_to = parseInt(response.data.food.available_hours.fri_to.substr(0, 2)) + 12;
                }
                else {

                    time_to = parseInt(response.data.food.available_hours.fri_to.substr(0, 2));

                }

                if (time_frm <= curr_hour && time_to >= curr_hour) {

                    console.log("range in betweeen FRI");
                }
                else {
                    console.log("range not in betweeen FRI");
                    var src = $("#avail_status").attr('src').replace("public/images/icon/online.png", "public/images/icon/offline.png");
                    $("#avail_status").attr('src', src);

                }

            }

            if ('sat' === curr_day_for_match) {

                console.log('ITS SAt');



                if (response.data.food.available_hours.sat_from.substr(response.data.food.available_hours.sat_from.length - 2) == 'PM') {
                    time_frm = parseInt(response.data.food.available_hours.sat_from.substr(0, 2)) + 12;
                }
                else {
                    time_frm = parseInt(response.data.food.available_hours.sat_from.substr(0, 2));
                }


                if (response.data.food.available_hours.sat_to.substr(response.data.food.available_hours.sat_to.length - 2) == 'PM') {

                    time_to = parseInt(response.data.food.available_hours.sat_to.substr(0, 2)) + 12;
                }
                else {

                    time_to = parseInt(response.data.food.available_hours.sat_to.substr(0, 2));

                }

                if (time_frm <= curr_hour && time_to >= curr_hour) {

                    console.log("range in betweeen SAT");
                }
                else {
                    console.log("range not in betweeen SAT");
                    var src = $("#avail_status").attr('src').replace("public/images/icon/online.png", "public/images/icon/offline.png");
                    $("#avail_status").attr('src', src);

                }

            }

            if ('sun' === curr_day_for_match) {

                console.log('ITS SUN');



                if (response.data.food.available_hours.sun_from.substr(response.data.food.available_hours.sun_from.length - 2) == 'PM') {
                    time_frm = parseInt(response.data.food.available_hours.sun_from.substr(0, 2)) + 12;
                }
                else {
                    time_frm = parseInt(response.data.available_hours.sun_from.substr(0, 2));
                }


                if (response.data.food.available_hours.sat_to.substr(response.data.food.available_hours.sun_to.length - 2) == 'PM') {

                    time_to = parseInt(response.data.food.available_hours.sun_to.substr(0, 2)) + 12;
                }
                else {

                    time_to = parseInt(response.data.available_hours.sun_to.substr(0, 2));

                }

                if (time_frm <= curr_hour && time_to >= curr_hour) {

                    console.log("range in betweeen SUN");
                }
                else {
                    console.log("range not in betweeen SUN");
                    var src = $("#avail_status").attr('src').replace("public/images/icon/online.png", "public/images/icon/offline.png");
                    $("#avail_status").attr('src', src);

                }

            }
            //   var src= $("#avail_status").attr('src').replace("public/images/icon/online.png","public/images/icon/offline.png");
            //     $("#avail_status").attr('src', src);

            //               $state.transitionTo('.detail', {id: newId}, {
            //     location: true,
            //     inherit: true,
            //     relative: $state.$current,
            //     notify: false
            // });
            //   $scope.day.push(response.data.available_hours);

            // for( var i=0;i<7;i++){

            //     if(response.data.available_hours.hasOwnProperty('mon_from')){

            //         $scope.day_obj.mon_from=response.data.available_hours.mon_from;
            //         $scope.day_obj.mon_to=response.data.available_hours.mon_to;
            //         $scope.day.push( $scope.day_obj);

            //     }
            //      if(response.data.available_hours.hasOwnProperty('tue_from')){

            //         $scope.day_obj.tue_from=response.data.available_hours.tue_from;
            //         $scope.day_obj.tue_to=response.data.available_hours.tue_to;
            //         $scope.day.push( $scope.day_obj);

            //     }
            // }
            //   console.log( $scope.day);

        }, function myError(response) {



        });

    }


// CHECKOUT PAGE ALL FUNCTIONING



$scope.login_check_checkout=function(){

 
        console.log($cookieStore.get('s3cr3t_user'));
           console.log('testfffffff');
        if($cookieStore.get('s3cr3t_user')!=undefined){
            $scope.login_check_checkout_page=false;
             $scope.show_delivery_addr_checkout=true;
             $scope.show_review_order_checkout=true;
        
        }
        else{
          
         
              
            $scope.login_check_checkout_page=true;
            $scope.show_delivery_addr_checkout=false;
            $scope.show_review_order_checkout=false;
             
             
        }   
}

    $scope.user_login_checkout=function(user_login){


                   $scope.u = user_login;


        console.log(user_login);


        $http({
            method: "POST",
            url: "user/user-login",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response.data);
          
            if (response.data == "user not found") {
                sweetAlert("Un Authorized", "Check credentials Again.", "error");
            }
            else if (response.data == "account disabled") {

                sweetAlert("Un Authorized", "Check credentials Again.", "error");
                $scope.user_status = true;

            }
            else {


                setTimeout(function () {
                    swal({
                        title: "Credentials Verified !",
                        text: "Please Review Your Order Details",
                        type: "success",
                        confirmButtonText: "OK"
                    },
                        function (isConfirm) {
                            if (isConfirm) {
                                
                                //$location.path('/cook_profile');
                                $scope.user_login = "";
                                console.log('VERIFIED');
                                $scope.after_success_login_message = true;
                                $cookieStore.put('s3cr3t_user', response.data[0]._id);
                                $cookieStore.put('s3cr3t_user_data', response.data);
                                
                                $route.reload();
            // $scope.show_review_order_checkout=false;
                               //  window.location.href = "#/checkout";
                            }
                        });
                }, 100);


            }
        }, function myError(err) {

            sweetAlert("Un Authorized", "Check credentials Again.", "error");
        });





    }


    $scope.add_user_details_checkout = function (user_details) {

        $scope.u = user_details;


        $http({
            method: "POST",
            url: "user/add-user-info",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response);
            $scope.user_details = "";
            $scope.after_success_reg_message = true;

            $timeout(function () {
                $scope.after_success_reg_message = false;

            }, 6000);



        }, function myError(response) {

            $scope.already_register_user = true;
            $timeout(function () {
                $scope.already_register_user = false;

            }, 4000);

        });

    }


 $scope.update_user_address_checkout = function (address_details) {
        $scope.u = address_details;
        $scope.user_address_detail = "";
        $scope.u.user_id = $cookieStore.get('s3cr3t_user');

        
        $http({
            method: "POST",
            url: "user/user-address-add",
            data: $scope.u
        }).then(function mySucces(response) {

            $scope.getUserAddress();
            console.log('user address updating');
        }, function myError(response) {


        });


    }



       $scope.getUserAddress_checkout = function () {

        $scope.user_id = { user_id: $cookieStore.get('s3cr3t_user') };
        // console.log($scope.user_id);
        $http({
            method: "POST",
            url: "user/get-user-address",
            data: $scope.user_id
        }).then(function mySucces(response) {

            $scope.user_address_list = response.data[0].address;
            console.log(response.data[0].address);
        }, function myError(response) {


        });

    }


  $scope.fetch_cart_coll_checkout = function () {

        var cart_coll = [];
        var total_price = 0;
        var grand_total = 0;
        var item_len = 0;

        cart_coll = $cookieStore.get('check_out_coll');

        for (var i = 0; i < cart_coll.length; i++) {

            cart_coll[i].food_total_price = cart_coll[i].food_price * cart_coll[i].food_qty;
            total_price = total_price + cart_coll[i].food_total_price;

            item_len++;
        }



        $scope.checkout_cart_view = cart_coll;
        $scope.price_data.total_price = total_price;
        $scope.price_data.grand_total = total_price + 30;
        $scope.price_data.total_items = item_len;
 
    $scope.cusine_list_checkout=[];
        console.log('THIS IS CEHOUT KAR');
        console.log($scope.checkout_cart_view);
        
       
        var cus_list_obj={};
            for(var i=0;i<$scope.checkout_cart_view.length;i++){

                for(j=0;j<$scope.checkout_cart_view[i].food_cuisine.length;j++){
                    cus_list_obj={};
                    if($scope.checkout_cart_view[i].food_cuisine[j].status=="true"){

                            cus_list_obj.cuisine_name=$scope.checkout_cart_view[i].food_cuisine[j].category_name;
                            $scope.cusine_list_checkout.push(cus_list_obj);
                    }


                }
            }

        console.log($scope.cusine_list_checkout);

    }

    $scope.promo_detail={};
    $scope.coupon_success_show=false;

    $scope.check_promo_code=function(data){

        
        $scope.u={};
        $scope.u=data;
        $scope.u.user_id=$cookieStore.get('s3cr3t_user');
        $scope.u.cuisine_list=$scope.cusine_list_checkout;
        console.log($scope.u);
     $http({
            method: "POST",
            url: "user/check-promo-code",
            data: $scope.u
        }).then(function mySucces(response) {

            var res=response.data;
                if(res.status=='coupon expired'){

                    swal("Coupon Expired !", "Invalid Coupon Detail !", "error");

                }
                if(res.status=='coupon valid'){

                    swal("Coupon Applied !", "Coupon Successfully Applied !", "success");

                    if(res.coupon_discount_operation==" % "){
                      
                        var less_amt=($scope.price_data.grand_total/100)*res.coupon_discount_amount;
                        $scope.price_data.grand_total=$scope.price_data.grand_total-less_amt;
                         $scope.coupon_success_show=true;
                    }
                    if(res.coupon_discount_operation==" - ")
                    {
                         
                          $scope.price_data.grand_total=$scope.price_data.grand_total-res.coupon_discount_amount;
                          $scope.coupon_success_show=true;
                    }
                }

            console.log(response);
            console.log('THIS IS GRAND TOTAL BELOW');
            console.log($scope.price_data);

        }, function myError(response) {


        });

    }

}]);

/*******************************ADMIN CONTROLLER*************************** */

app.controller('admin_controller', ['$scope', '$http', '$rootScope', '$timeout', '$base64', 'cfpLoadingBar', 'Notification', '$cookieStore', '$location', function ($scope, $http, $rootScope, $timeout, $base64, cfpLoadingBar, Notification, $cookieStore, $location) {
    $rootScope.stylesheets = "";
    $rootScope.stylesheets = [
        { href: '../../pages/admin/css/reset.css', type: 'text/css' },
        { href: '../../../pages/admin/css/style.css', type: 'text/css' },
        { href: '../../pages/admin/css/media.css', type: 'text/css' },
        { href: '../../pages/admin/fonts/font-awesome/css/font-awesome.min.css', type: 'text/css' },
    ];

    $scope.user_info = {};
    $scope.cook_info = {};
    $scope.global_setting = {};
    $scope.social_setting = {};
    $scope.success_user_add = false;
    $scope.success_cook_delete = false;
    $scope.success_user_delete = false;
    $scope.user_list_deatils = {};
    $scope.cooks_list_deatils = {};

    $scope.add_user_via_admin = function (user_info) {
        $scope.u = {};
        $scope.u = user_info;
        $scope.user_info = "";
        $http({
            method: "POST",
            url: "admin/add-user-info",
            data: $scope.u
        }).then(function mySucces(response) {

            Notification.info({ message: 'User Successfully Added..', delay: 3000 });
            console.log(response.data);
            $scope.user_details = "";

        }, function myError(response) {

        });


    };

    $scope.temp_user_id = {};
    $scope.view_user_details_admin_temp = function (user_id) {

        $scope.temp_user_id = user_id;

        $cookieStore.put('temp_user_id', $scope.temp_user_id);

    }
    $scope.user_view_full = {};
    $scope.view_user_details_admin_fetch = function () {

        $scope.u = {};
        $scope.u.user_id = $cookieStore.get('temp_user_id');

        console.log($scope.u);

        $http({
            method: "POST",
            url: "admin/fetch-user-by-id",
            data: $scope.u
        }).then(function mySucces(response) {


            $scope.user_view_full = response.data[0];
            console.log(response.data);
            //  $scope.user_details="";

        }, function myError(response) {

        });

    }

    $scope.update_user_by_admin = function (val) {


        $http({
            method: "POST",
            url: "admin/update-user-by-id",
            data: val
        }).then(function mySucces(response) {


            Notification.info({ message: 'User Successfully Updated..', delay: 3000 });

            $scope.view_user_details_admin_fetch();

        }, function myError(response) {

        });
    }


    $scope.imageData_cook_banner_admin = "";
    $scope.upload_cook_banner_image_admin = function (files) {

        if (files[0] == undefined) return


        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('cook_banner').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            $scope.imageData_cook_banner_admin = $base64.encode(data);

            // console.log($scope.imageData_cook_banner_admin);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);

    }

    $scope.get_admin_id = function () {

        console.log('GETTING ADMIN ID');
        $http({
            method: "GET",
            url: "admin/get-admin-id",

        }).then(function mySucces(response) {


            $cookieStore.put('admin_id', response.data._id);

        }, function myError(response) {

        });
    }

    $scope.add_cook_via_admin = function (cook_info) {

        // Notification.warning({ message: 'Please Wait..', delay: 1000 });

        $scope.u = {};
        $scope.u = cook_info;
        $scope.u.cook_banner_img = $scope.imageData_cook_banner_admin;



        console.log($scope.imageData_cook_banner_admin);
        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/add-cook-info",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response.data);
            $scope.cook_info = "";
            swal("Cook Added!", "Cook Details Successfully Added!", "success");
            // $scope.imageData_cook_banner_admin = "";
            // $scope.picFile_cook_banner = "";
            // Notification.success({ message: 'Cook Successfully Added..', delay: 3000 });


        }, function myError(response) {

        });


    };

    //  $scope.stylesheets = [

    //       {href: '../../pages/admin/css/reset.css', type:'text/css'},
    //       {href: '../../../pages/admin/css/style.css', type:'text/css'},
    //       {href: '../../pages/admin/css/media.css', type:'text/css'},
    //       {href: '../../pages/admin/fonts/font-awesome/css/font-awesome.min.css', type:'text/css'},


    //     ];

    //     $scope.scripts = [

    //       {href: '../../pages/admin/js/fm.parallaxator.jquery.js', type:'text/javascript'},
    //       {href: '../../pages/admin/js/global.js', type:'text/javascript'},
    //       {href: '../../pages/admin/js/min.js', type:'text/javascript'},


    //     ];

    $scope.loadUsers = function () {

        $http({
            method: "GET",
            url: "admin/get-all-users",

        }).then(function mySucces(response) {

            $scope.user_list_deatils = response.data;
            console.log($scope.user_list_deatils);
        }, function myError(response) {

        });

    };

    $scope.loadCooks = function () {


        $http({
            method: "GET",
            url: "admin/get-all-cooks",

        }).then(function mySucces(response) {

            $scope.cooks_list_deatils = response.data;
            console.log($scope.cooks_list_deatils);
        }, function myError(response) {

        });

    };



    // selected checkebox for user/cooks
    $scope.selection = [];

    // toggle selection for a given cook/user by name
    $scope.toggleSelection = function toggleSelection(val) {

        var idx = $scope.selection.indexOf(val);

        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
            console.log($scope.selection);
        }

        // is newly selected
        else {
            $scope.selection.push(val);
            console.log($scope.selection);

            // $scope.food_details.occassion_list = $scope.selection;
        }
    }


    //This is used to check and Uncheck all checkbox
    $scope.checkAll = function () {
        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
        }
        angular.forEach($scope.cooks_list_deatils, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };

    $scope.tmp_cook_id;
    $scope.update_cook_details_temp = function (cook_id) {

        $scope.tmp_cook_id = cook_id;
        console.log(cook_id);
        $cookieStore.put('cook_update_id', $scope.tmp_cook_id);

    }

    $scope.update_details = {};
    $scope.update_cook_details_fetch = function () {

        $scope.u = {};
        $scope.u.cook_id = $cookieStore.get('cook_update_id');

        console.log($scope.u);

        $http({
            method: "POST",
            url: "admin/fetch-cook-by-id",
            data: $scope.u
        }).then(function mySucces(response) {

            $scope.update_details = response.data[0];
            console.log($scope.update_details);
        }, function myError(response) {
            console.log('err');
        });
    }

    $scope.update_cook_details_save = function (data) {

        if ($scope.imageData_cook_banner_admin != "") {

            $scope.u = data;
            $scope.u.cook_id = $cookieStore.get('cook_update_id');
            $scope.u.cook_updated_banner_img = $scope.imageData_cook_banner_admin;
            console.log('ANKUR');
            console.log($scope.u);
            // $http({
            //     method: "POST",
            //     url: "admin/update-cook-by-id",
            //     data: $scope.u
            // }).then(function mySucces(response) {
            //     Notification.info({ message: 'Cook Details Successfully Updated.!', delay: 4000 });
            //     console.log(response);
            // }, function myError(response) {
            //     console.log('err');
            // });

        }

        else if ($scope.imageData_cook_banner_admin == "") {

            $scope.u = data;
            $scope.u.cook_id = $cookieStore.get('cook_update_id');

            console.log($scope.u);

            $http({
                method: "POST",
                url: "admin/update-cook-by-id",
                data: $scope.u
            }).then(function mySucces(response) {
                Notification.info({ message: 'Cook Details Successfully Updated.!', delay: 3000 });
                console.log(response);
            }, function myError(response) {
                console.log('err');
            });

        }

    }

    $scope.cook_delete = function () {

        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {

                    console.log($scope.selection);
                    if ($scope.selection.length < 1) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {

                        if ($scope.hasAllCookChecked) {
                            $http({
                                method: "GET",
                                url: "admin/delete-all-cook",

                            }).then(function mySucces(response) {
                                $scope.hasAllCookChecked.selected = false;
                                swal("Deleted!", "All Cooks Are Deleted!", "success");


                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        else {

                            $http({
                                method: "POST",
                                url: "admin/delete-cook",
                                data: $scope.selection
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Cook Successfully Deleted..!", "success");
                                $scope.selection = [];
                                $scope.loadCooks();

                                // Notification.error({message: 'Cook Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }


                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete cook :)", "error");
                }
            });

        // console.log($scope.selection);


    };

    var count_all_cook = false;
    $scope.checkAll_for_cook = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_cook = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_cook = false;
        }
        angular.forEach($scope.cooks_list_deatils, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };


    $scope.selectedItemChanged_Cook = function (val) {
        console.log(val)
        swal({
            title: "Are you sure?",
            text: "You are going to Change Status of Cook!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Change it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    if ($scope.selection.length < 1 && count_all_cook == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {

                        if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == false && $scope.selection.length > 0) {

                            if (val == "Active") {

                                console.log('Selected Active by ID');
                                // console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/active-cook-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {

                                    $scope.selection = [];
                                    $timeout(function () {

                                        $scope.loadCooks();

                                    }, 400);
                                    swal("Changed!", "Cook Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });
                            }

                            else if (val == "Inactive") {


                                console.log('Selected Inactive by Id');
                                // console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/inactive-cook-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {
                                    $scope.selection = [];

                                    $timeout(function () {

                                        $scope.loadCooks();

                                    }, 400);
                                    swal("Changed!", "Cook Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });



                            }
                        }
                        else {


                            if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == true) {

                                console.log('test');
                                // $scope.u={};
                                // $scope.u.admin_id=$cookieStore.get('admin_id');

                                if (val == "Active") {

                                    console.log('Active all user');

                                    $http({
                                        method: "POST",
                                        url: "admin/active-all-cook",

                                    }).then(function mySucces(response) {
                                        $scope.hasAllCookChecked = false;
                                        $scope.selection = [];
                                        $timeout(function () {

                                            $scope.loadCooks();

                                        }, 400);


                                        swal("Activated All !", "Cook Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });
                                }

                                else if (val == "InActive") {

                                    console.log('Inactive all cook');

                                    $http({
                                        method: "POST",
                                        url: "admin/inactive-all-cook",

                                    }).then(function mySucces(response) {
                                        $scope.selection = [];
                                        $scope.hasAllCookChecked = false;
                                        $timeout(function () {

                                            $scope.loadCooks();

                                        }, 400);
                                        swal("Inactivated All !", "Cook Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });

                                }

                            }

                        }

                    }
                }
                else {
                    swal("Cancelled", "Your cancelled to Change Status of Cooks :)", "error");
                }


            });


    }

    $scope.show_updated_fields = function (val) {


        var list = [];
        console.log($scope.cooks_list_deatils);

        for (var i = 0; i < $scope.cooks_list_deatils.length; i++) {

            if ($scope.cooks_list_deatils[i].cook_email == val) {

                list.push($scope.cooks_list_deatils[i].updated_fields);

            }
        }

        console.log(list[0]);

        swal("Updated Fields", list[0][0].field_name);

    }


    var count_all_user = false;
    $scope.checkAll_for_user = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_user = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_user = false;
        }
        angular.forEach($scope.user_list_deatils, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };


    $scope.user_delete = function () {



        swal({
            title: "Are you sure?",
            text: "You are going to delete User Details.!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_user == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {

                        console.log('checkbox selected');
                        console.log($scope.selection);
                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {
                            console.log('delting all user');

                            $http({
                                method: "POST",
                                url: "admin/delete-all-user",

                            }).then(function mySucces(response) {

                                console.log(response);
                                swal("Deleted!", "All Users Are Deleted!", "success");
                                $timeout(function () {

                                    $scope.loadUsers();

                                }, 400);

                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_user == false || $scope.hasAllCookChecked == false) {
                            console.log('delting Selected user');
                            $scope.u.selected_user = $scope.selection;


                            $http({
                                method: "POST",
                                url: "admin/delete-selected-user",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "User Successfully Deleted..!", "success");
                                $scope.selection = [];

                                $timeout(function () {

                                    $scope.loadUsers();

                                }, 400);
                                // Notification.error({message: 'Cook Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_user == true && $scope.hasAllCookChecked == true) {
                            console.log('delting all user 2');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-user",

                            }).then(function mySucces(response) {

                                console.log(response);
                                swal("Deleted!", "All Users Are Deleted!", "success");

                                $timeout(function () {

                                    $scope.loadUsers();

                                }, 400);
                            }, function myError(response) {
                                console.log('err');
                            });
                        }

                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete User :)", "error");
                }
            });



    };


    $scope.selectedItemChanged_User = function (val) {

        swal({
            title: "Are you sure?",
            text: "You are going to Change Status of Users!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Change it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    if ($scope.selection.length < 1 && count_all_user == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {

                        if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == false && $scope.selection.length > 0) {

                            if (val == "Active") {

                                console.log('Selected Active by ID');
                                // console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/active-user-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {

                                    $scope.selection = [];
                                    $timeout(function () {

                                        $scope.loadUsers();

                                    }, 400);
                                    swal("Changed!", "User Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });
                            }

                            else if (val == "Inactive") {


                                console.log('Selected Inactive by Id');
                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/inactive-user-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {
                                    $scope.selection = [];

                                    $timeout(function () {

                                        $scope.loadUsers();

                                    }, 400);
                                    swal("Changed!", "User Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });



                            }
                        }
                        else {


                            if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == true) {

                                console.log('test');
                                // $scope.u={};
                                // $scope.u.admin_id=$cookieStore.get('admin_id');

                                if (val == "Active") {

                                    console.log('Active all user');

                                    $http({
                                        method: "POST",
                                        url: "admin/active-all-user",

                                    }).then(function mySucces(response) {
                                        $scope.hasAllCookChecked = false;
                                        $scope.selection = [];
                                        $timeout(function () {

                                            $scope.loadUsers();

                                        }, 400);


                                        swal("Activated All !", "User Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });
                                }

                                else if (val == "Inactive") {

                                    console.log('Inactive all user');

                                    $http({
                                        method: "POST",
                                        url: "admin/inactive-all-user",

                                    }).then(function mySucces(response) {
                                        $scope.selection = [];
                                        $scope.hasAllCookChecked = false;
                                        $timeout(function () {

                                            $scope.loadUsers();

                                        }, 400);
                                        swal("Inactivated All !", "User Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });

                                }

                            }

                        }

                    }
                }
                else {
                    swal("Cancelled", "Your cancelled to Change Status of User :)", "error");
                }


            });


    }



    /*******************SAVING GLOBAL SETTINGS*********** */

    $scope.imageData_web_logo = "";
    $scope.upload_websiste_logo = function (files) {

        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('web_logo').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            $scope.imageData_web_logo = $base64.encode(data);


            // console.log($scope.imageData_web_logo);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);

    }

    $scope.imageData_footer_logo = "";
    $scope.upload_footer_logo = function (files) {

        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('footer_logo').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            $scope.imageData_footer_logo = $base64.encode(data);

            //console.log($scope.imageData);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);

    }

    $scope.imageData_favicon = "";
    $scope.upload_favicon = function (files) {

        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('favicon').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            $scope.imageData_favicon = $base64.encode(data);

            // console.log($scope.imageData_favicon);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);

    }

    $scope.save_global_setting = function (data) {

        $scope.u = {};
        $scope.u = data;
        $scope.u.website_logo = $scope.imageData_web_logo;
        $scope.u.footer_logo = $scope.imageData_footer_logo;
        $scope.u.favicon = $scope.imageData_favicon;
        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/save-global-setting",
            data: $scope.u
        }).then(function mySucces(response) {

            $scope.global_setting = "";
            $scope.imageData_web_logo = "";
            $scope.imageData_footer_logo = "";
            $scope.picFile2 = "";
            $scope.picFile3 = "";
            $scope.picFile4 = "";
            Notification.info({ message: 'Global Settings Successfully Updated.!', delay: 3000 });
            $scope.fetch_global_setting();
        }, function myError(response) {
            console.log('err');
        });
    }

    $scope.fetch_global_setting = function (data) {

        console.log('FETCHING');


        $http({
            method: "GET",
            url: "admin/fetch-global-settings"

        }).then(function mySucces(response) {

            console.log(response.data);
            $scope.global_setting = response.data[0];
        }, function myError(response) {
            console.log('err');
        });
    }

    /****************** INFORMATION PAGES  INFO ************ */

    $scope.save_information_page_details = {};


    $scope.save_information_page = function (val) {

        $scope.u.admin_id = $cookieStore.get('admin_id');
        $scope.u.info = val;
        console.log(val);
        $http({
            method: "POST",
            url: "admin/add-info-pages",
            data: $scope.u
        }).then(function mySucces(response) {

            Notification.info({ message: 'Information Page Successfully Added.', delay: 3000 });
            $scope.save_information_page_details = "";
        }, function myError(response) {
            console.log('err');
        });

    }

    $scope.view_info_detail = {};
    $scope.fetch_info_pages = function (info_id) {

        $http({
            method: "POST",
            url: "admin/fetch-info-pages",

        }).then(function mySucces(response) {

            $scope.view_info_detail = response.data.info_pages;
            console.log(response.data.info_pages);

        }, function myError(response) {
            console.log('err');
        });

    }

    $scope.update_info_pages_temp = function (info_id) {

        console.log(info_id);

        $scope.tmp_info_page_id = info_id;
        // // console.log(tmp_coupon_id) ;
        $cookieStore.put('info_page_id', $scope.tmp_info_page_id);

    }

    $scope.update_page_info_model = {};
    $scope.update_info_pages_fetch = function () {

        $scope.u = {};
        $scope.u.info_page_id = $cookieStore.get('info_page_id');

        $http({
            method: "POST",
            url: "admin/fetch-info_page-by-id",
            data: $scope.u
        }).then(function mySucces(response) {

            $scope.update_page_info_model = response.data.info_pages[0];
            console.log($scope.update_page_info_model);
        }, function myError(response) {
            console.log('err');
        });
    }
    $scope.update_info_page = function () {


        $scope.u = {};

        $scope.u = $scope.update_page_info_model;
        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/update-info-page",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response);
            $scope.update_info_pages_fetch();
            Notification.info({ message: 'Info Page Successfully Updated.', delay: 3000 });
            //     $scope.update_page_info_model=response.data.info_pages[0];
            //    console.log( $scope.update_page_info_model);
        }, function myError(response) {
            console.log('err');
        });
    }

    var count_all_info_pages = false;
    $scope.checkAll_for_info_pages = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_info_pages = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_info_pages = false;
        }
        angular.forEach($scope.view_info_detail, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };

    $scope.info_page_delete = function () {


        swal({
            title: "Are you sure?",
            text: "You are going to delete Information Page.!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_info_pages == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {



                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {
                            console.log('delete all pages');
                            $scope.u = {};
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-info-pages",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All Info Pages Are Deleted!", "success");
                                $timeout(function () {
                                    $scope.fetch_info_pages();

                                }, 400);

                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_info_pages == false || $scope.hasAllCookChecked == false) {
                            $scope.u = {};
                            $scope.u.selected_info_page = $scope.selection;
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            $http({
                                method: "POST",
                                url: "admin/delete-selected-info-pages",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Info Page Successfully Deleted..!", "success");
                                $scope.selection = [];
                                $timeout(function () {
                                    $scope.fetch_info_pages();

                                }, 400);

                                // Notification.error({message: 'Info Page Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_info_pages == true && $scope.hasAllCookChecked == true) {
                            console.log('delete all pages');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-info-pages",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All Info Pages Are Deleted!", "success");

                                $timeout(function () {
                                    $scope.fetch_info_pages();

                                }, 400);
                            }, function myError(response) {
                                console.log('err');
                            });
                        }

                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete cook :)", "error");
                }
            });

        // console.log($scope.selection);


    };



    /******************SAVE COUPON************ */


    $scope.save_coupon_details = {};
    $scope.after_success_coupon_add = false;

    $scope.save_coupon_page = function (coupon_details) {
        $scope.u = coupon_details;
        $scope.u.coupon_used_counter = 0;
        $scope.u.categories = $scope.modernBrowsers;
        $scope.u.admin_id = $cookieStore.get('admin_id');
        console.log($scope.u);
        //   console.log( $scope.modernBrowsers);
        $http({
            method: "POST",
            url: "admin/add-coupon-info",
            data: $scope.u
        }).then(function mySucces(response) {
            $scope.save_coupon_details = "";
            for (var i = 0; i < $scope.modernBrowsers.length; i++) {

                $scope.modernBrowsers[i].ticked = false;
            };
            Notification.info({ message: 'Coupon Successfully Added.', delay: 3000 });
            console.log($scope.modernBrowsers);
        }, function myError(response) {
            console.log('err');
        });
    }

    $scope.cuisine_name_list = [];


    $scope.fetch_cuisine_name_for_add = function (social_details) {


        $http({
            method: "GET",
            url: "admin/fetch-cuisine-name",

        }).then(function mySucces(response) {

            for (var i = 0; i < response.data.length; i++) {
                var send = {
                    "name": response.data[i].category_name,
                    ticked: false
                };
                $scope.cuisine_name_list.push(send);


            }

            // console.log($scope.cuisine_name_list);


        }, function myError(response) {
            console.log('err');
        });
    }

    $scope.fetch_cuisine_name = function (social_details) {


        $http({
            method: "GET",
            url: "admin/fetch-cuisine-name",

        }).then(function mySucces(response) {

            for (var i = 0; i < response.data.length; i++) {
                var send = {
                    "name": response.data[i].category_name,
                    ticked: false
                };
                $scope.cuisine_name_list.push(send);


            }
            $scope.update_coupon_details_fetch();
            // console.log($scope.cuisine_name_list);


        }, function myError(response) {
            console.log('err');
        });
    }

    $scope.modernBrowsers = $scope.cuisine_name_list;
    // $scope.modernBrowsers = [
    //  	{name: "Opera"	},
    //  	{		name: "Internet Explorer"		},
    //  	{		name: "Firefox"	},
    //  	{		name: "Safari"},
    //  	{		name: "Chrome"	},
    // ];
    $scope.jg = function () {
        console.log($scope.modernBrowsers);
    }


    $scope.coupon_fetch_detail = {};

    $scope.u = {};
    $scope.u.admin_id = $cookieStore.get('admin_id');

    $scope.fetch_coupon = function () {
        $http({
            method: "POST",
            url: "admin/fetch-coupon-info",
            data: $scope.u
        }).then(function mySucces(response) {

            $scope.coupon_fetch_detail = response.data.coupon_infos;

        }, function myError(response) {
            console.log('err');
        });
    }

    var count_all_coupon = false;
    $scope.checkAll_for_coupon = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_coupon = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_coupon = false;
        }
        angular.forEach($scope.coupon_fetch_detail, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };

    $scope.coupon_delete = function () {


        swal({
            title: "Are you sure?",
            text: "You are going to delete Coupon Details.!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_coupon == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {



                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {

                            $scope.u = {};
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-coupon",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                $scope.hasAllCookChecked = false;
                                $scope.hasAllCookChecked.selected = false;
                                swal("Deleted!", "All Coupons Are Deleted!", "success");

                                $scope.fetch_coupon();
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_coupon == false || $scope.hasAllCookChecked == false) {

                            $scope.u.selected_coupons = $scope.selection;
                            $scope.u.admin_id = $cookieStore.get('admin_id');

                            $http({
                                method: "POST",
                                url: "admin/delete-selected-coupon",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Coupon Successfully Deleted..!", "success");
                                $scope.selection = [];
                                $scope.fetch_coupon();

                                // Notification.error({message: 'Cook Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_coupon == true && $scope.hasAllCookChecked == true) {

                            $scope.u = {};
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-coupon",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                $scope.hasAllCookChecked = false;
                                $scope.hasAllCookChecked.selected = false;
                                swal("Deleted!", "All Coupons Are Deleted!", "success");

                                $scope.fetch_coupon();
                            }, function myError(response) {
                                console.log('err');
                            });
                        }

                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete cook :)", "error");
                }
            });

        // console.log($scope.selection);


    };

    $scope.tmp_coupon_id;
    $scope.update_coupon_details_temp = function (coupon_id) {


        $scope.tmp_coupon_id = coupon_id;
        // console.log(tmp_coupon_id) ;
        $cookieStore.put('coupon_update_id', $scope.tmp_coupon_id);

    }

    // $scope.update_details={};
    $scope.update_coupon_details_fetch = function (coupons) {

        $scope.u = {};
        $scope.u.coupon_id = $cookieStore.get('coupon_update_id');
        $scope.u.admin_id = $cookieStore.get('admin_id');

        console.log('this is updated coupon id');
      

        $http({
            method: "POST",
            url: "admin/fetch-coupon-by-id",
            data: $scope.u
        }).then(function mySucces(response) {

            $scope.save_coupon_details = response.data[0].coupon_infos[0];
            console.log(response.data[0].coupon_infos[0]);

            for (var i = 0; i < response.data[0].coupon_infos[0].categories.length; i++) {

                if (response.data[0].coupon_infos[0].categories[i].ticked == true) {
                    //   console.log($scope.modernBrowsers[i]);
                    $scope.modernBrowsers[i].ticked = true;
                }
                else {
                    $scope.modernBrowsers[i].ticked = false;
                    // console.log($scope.modernBrowsers[i]);
                }

            }
            console.log();
            console.log('UP');
        }, function myError(response) {
            console.log('err');
        });
    }


    $scope.update_coupon_details = function (coupons) {

        $scope.u = {};
        // $scope.u.coupon_id= $cookieStore.get('coupon_update_id');

        $scope.u = coupons;
        $scope.u.categories = $scope.modernBrowsers;


        $http({
            method: "POST",
            url: "admin/update-coupon-by-id",
            data: $scope.u
        }).then(function mySucces(response) {
            Notification.success({ message: 'Coupon Successfully Updated..', delay: 3000 });
            $scope.update_coupon_details_fetch();

        }, function myError(response) {
            console.log('err');
        });
    }



    $scope.selectedItemChanged_Coupon = function (val) {

        swal({
            title: "Are you sure?",
            text: "You are going to Change Status of Coupons!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Change it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    if ($scope.selection.length < 1 && count_all_coupon == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {

                        if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == false && $scope.selection.length > 0) {

                            if (val == "Enable") {

                                console.log('Selected Enabling');
                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/enable-coupon-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {

                                    $scope.selection = [];
                                    $timeout(function () {

                                        $scope.fetch_coupon();

                                    }, 400);
                                    swal("Changed!", "Coupon Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });
                            }

                            else if (val == "Disable") {
                                console.log('Selected Disabling');
                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/disable-coupon-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {
                                    $scope.selection = [];

                                    $timeout(function () {

                                        $scope.fetch_coupon();

                                    }, 400);
                                    swal("Changed!", "Coupon Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });

                            }

                        }
                        else
                            if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == true) {

                                $scope.u = {};
                                $scope.u.admin_id = $cookieStore.get('admin_id');

                                if (val == "Enable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/enable-all-coupon",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.hasAllCookChecked = false;
                                        $scope.selection = [];
                                        $timeout(function () {

                                            $scope.fetch_coupon();

                                        }, 400);


                                        swal("Changed!", "Coupon Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });
                                }

                                else if (val == "Disable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/disable-all-coupon",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.selection = [];
                                        $scope.hasAllCookChecked = false;
                                        $timeout(function () {

                                            $scope.fetch_coupon();

                                        }, 400);
                                        swal("Changed!", "Coupon Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });

                                }

                            }





                    }
                }
                else {
                    swal("Cancelled", "Your cancelled to Change Coupons Status :)", "error");
                }


            });


    }
    /******************SAVE SOCIAL INFOS************ */

    $scope.choices = [{ id: 'choice1' }];

    $scope.addNewChoice = function () {
        var newItemNo = $scope.choices.length + 1;
        $scope.choices.push({ 'id': 'choice' + newItemNo });
    };

    $scope.removeChoice = function () {
        var lastItem = $scope.choices.length - 1;
        $scope.choices.splice(lastItem);
    };
    $scope.removeChoice_for_banner = function (val) {
        var lastItem = $scope.choices.length - 1;
        $scope.choices.splice(lastItem);
        ts.splice(val, 1);

    };
    $scope.addNewChoice_for_banner = function () {
        var newItemNo = $scope.update_banner_model_for_details.length + 1;
        $scope.update_banner_model_for_details.push({ 'id': 'choice' + newItemNo });
    };
    $scope.removeChoice_for_banner_edit = function (val) {
        var lastItem = $scope.update_banner_model_for_details.length - 1;
        $scope.update_banner_model_for_details.splice(lastItem);
        ts.splice(val, 1);

    };

    $scope.social_info_details = {};

    $scope.getSocialInfos = function () {

        $scope.u = {};
        $scope.u.admin_id = $cookieStore.get('admin_id');

        $http({
            method: "POST",
            url: "admin/get-social-infos",
            data: $scope.u
        }).then(function mySucces(response) {

            $scope.choices = response.data[0].social_info;

            console.log(response.data[0].social_info);
        }, function myError(response) {

        });

    }


    $scope.save_social_details = {};
    $scope.after_success_social_info_add = false;
    $scope.save_social_setting = function (social_details) {

        $scope.u = {};
        $scope.u.admin_id = $cookieStore.get('admin_id');
        $scope.u.social = $scope.choices;
        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/add-social-info",
            data: $scope.u
        }).then(function mySucces(response) {

            $timeout(function () {

                $scope.getSocialInfos();

            }, 800);

            Notification.success({ message: 'Social Media Successfully Updated', delay: 3000 });
            console.log(response);
        }, function myError(response) {
            console.log('err');
        });
    }

    $scope.remove_social_media = function (val) {


        $scope.u.social_media = val;
        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/remove-social-media",
            data: $scope.u
        }).then(function mySucces(response) {


            $timeout(function () {

                $scope.getSocialInfos();

            }, 800);

            Notification.warning({ message: 'Social Media Successfully Deleted', delay: 3000 });
            console.log(response);
        }, function myError(response) {
            console.log('err');
        });
    }

    /********** BANNER add/edit/delete/update IN ADMIN ****/

    $scope.banner_details = {};
    $scope.banner_image_list = [];
    $scope.banner_lst = {};
    var ts = [];   //for multiple image upload
    $scope.ts_img_data = [];


    $scope.save_banner_info = function (banner) {

        //   ts.splice(1);
        var key = ts.length;
        var len = 0;

        for (var i = 0; i < ts.length; i++) {

            if (ts[i] == undefined) return;

            var f = ts[i];
            r = new FileReader();

            r.onloadend = function (e) {

                var data = e.target.result;
                $scope.cc = $base64.encode(data);

                $scope.ts_img_data.push($scope.cc);


                len++;



            }

            r.readAsBinaryString(f);



        }
        Notification.warning({ message: 'Please Wait For a While...', delay: 3000 });
        $timeout(function () {

            console.log(key);
            if (key == len) {
                $scope.u = {};
                $scope.u.banner_name = $scope.banner_details.banner_name;

                $scope.u.banner_status = $scope.banner_details.banner_status;
                $scope.u.choices = $scope.choices;
                $scope.u.img = $scope.ts_img_data;
                $scope.u.admin_id = $cookieStore.get('admin_id');

                //console.log($scope.u);
                console.log($scope.u);
                $http({
                    method: "POST",
                    url: "admin/add-banner-details",
                    data: $scope.u
                }).then(function mySucces(response) {

                    $scope.ts_img_data = [];
                    $scope.u = "";
                    $scope.banner_details = "";
                    $scope.choices = [{ id: 'choice1' }];
                    console.log(response);
                    Notification.info({ message: 'Banner Successfully Added', delay: 4000 });
                    $location.path('/admin/view-banners');
                }, function myError(response) {
                    console.log('err');
                });
            }


        }, 3000);

        // if($scope.key>0){

        //console.log($scope.ts_img_data);   
        // $scope.banner_details.details = banner;



    }

    $scope.imageData_banner = "";

    $scope.upload_banner_image = function (files) {


        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('file').files[0];
        ts.push(files[0]);
        console.log(ts);
        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);
    }
    $scope.imageData_banner = "";

    $scope.upload_banner_image_update = function (files, id) {


        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById(id).files[0];
        ts.push(files[0]);
        console.log(ts);
        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);
    }
    $scope.edit_banner_image_api = function (files, id, index) {


        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById(id).files[0];
        // ts.push(files[0]);
        // console.log(ts);
        r = new FileReader();

        r.onloadend = function (e) {
            $scope.u = {};
            var data = e.target.result;
            $scope.u.banner_img = $base64.encode(data);
            $scope.u.banner_id = id;
            // $scope.u={};
            // $scope.banner_id=id;
            // $scope.new_banner_img=data;


            console.log($scope.u);
            $http({
                method: "POST",
                url: "admin/update-banner-img-by-id",
                data: $scope.u
            }).then(function mySucces(response) {

                $scope.update_banner_fetch();

            }, function myError(response) {
                console.log('err');
            });
            //         //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);
    }
    $scope.fetch_banner_details = {};
    $scope.fetch_all_banner_detail = function (details) {

        $http({
            method: "GET",
            url: "admin/fetch-all-banner-details",

        }).then(function mySucces(response) {

            console.log(response);
            $scope.fetch_banner_details = response.data;

        }, function myError(response) {
            console.log('err');
        });

    }

    var count_all_banners = false;
    $scope.checkAll_for_banners = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_banners = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_banners = false;
        }
        angular.forEach($scope.fetch_banner_details, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };

    $scope.banner_delete = function () {


        swal({
            title: "Are you sure?",
            text: "You are going to delete Banner Details.!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_banners == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {



                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {

                            $scope.u = {};
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-banners",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All  Banners Are Deleted!", "success");
                                $timeout(function () {
                                    $scope.fetch_all_banner_detail();

                                }, 400);

                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_banners == false || $scope.hasAllCookChecked == false) {

                            $scope.u = {};
                            $scope.u.selected_banner = $scope.selection;
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            console.log($scope.u);
                            $http({
                                method: "POST",
                                url: "admin/delete-selected-banner",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Banner Successfully Deleted..!", "success");
                                $scope.selection = [];
                                $timeout(function () {
                                    $scope.fetch_all_banner_detail();

                                }, 400);

                                // Notification.error({message: 'Info Page Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_banners == true && $scope.hasAllCookChecked == true) {
                            $scope.u = {};
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-banners",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All  Banners Are Deleted!", "success");
                                $timeout(function () {
                                    $scope.fetch_all_banner_detail();

                                }, 400);

                            }, function myError(response) {
                                console.log('err');
                            });
                        }

                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete cook :)", "error");
                }
            });

        // console.log($scope.selection);



    };

    $scope.selectedItemChanged_Banner = function (val) {

        swal({
            title: "Are you sure?",
            text: "You are going to Change Status of Banners!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Change it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    if ($scope.selection.length < 1 && count_all_banners == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {

                        if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == false && $scope.selection.length > 0) {

                            if (val == "Enable") {


                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/enable-banner-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {

                                    $scope.selection = [];
                                    $timeout(function () {

                                        $scope.fetch_all_banner_detail();

                                    }, 400);
                                    swal("Enabled!", "Banners Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });
                            }

                            else if (val == "Disable") {
                                console.log('Selected Disabling');
                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/disable-banner-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {
                                    $scope.selection = [];

                                    $timeout(function () {

                                        $scope.fetch_all_banner_detail();

                                    }, 400);
                                    swal("Disabled!", "Banners Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });

                            }

                        }
                        else
                            if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == true) {

                                $scope.u = {};
                                $scope.u.admin_id = $cookieStore.get('admin_id');

                                if (val == "Enable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/enable-all-banner",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.hasAllCookChecked = false;
                                        $scope.selection = [];
                                        $timeout(function () {

                                            $scope.fetch_all_banner_detail();

                                        }, 400);


                                        swal("Enabled All!", "Banners Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });
                                }

                                else if (val == "Disable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/disable-all-banner",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.selection = [];
                                        $scope.hasAllCookChecked = false;
                                        $timeout(function () {

                                            $scope.fetch_all_banner_detail();

                                        }, 400);
                                        swal("Disabled All!", "Banners Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });

                                }

                            }





                    }
                }
                else {
                    swal("Cancelled", "Your cancelled to Change Coupons Status :)", "error");
                }


            });


    }

    $scope.tmp_banner_id = ""
    $scope.update_banner_temp = function (banner_id) {

        console.log(banner_id);

        $scope.tmp_banner_id = banner_id;
        $cookieStore.put('banner_id', $scope.tmp_banner_id);

    }

    $scope.update_banner_model = {};
    $scope.update_banner_model_for_details = {};
    $scope.update_banner_fetch = function () {

        $scope.u = {};
        $scope.u.banner_id = $cookieStore.get('banner_id');

        $http({
            method: "POST",
            url: "admin/fetch-banner-by-id",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response);
            $scope.update_banner_model = response.data;
            $scope.update_banner_model_for_details = response.data.banner_details;
            console.log($scope.update_banner_model_for_details);
            // console.log($scope.update_page_info_model);
        }, function myError(response) {
            console.log('err');
        });
    }
    $scope.update_banner = function () {


        $scope.u = {};
        $scope.u.banner_info = $scope.update_banner_model;
        $scope.u.banner_details = $scope.update_banner_model_for_details;
        console.log($scope.u.banner_info);
        Notification.info({ message: 'Banner Successfully Updated.', delay: 3000 });
        $http({
            method: "POST",
            url: "admin/update-banner-details",
            data: $scope.u.banner_info
        }).then(function mySucces(response) {

            // console.log(response);
            // $scope.update_info_pages_fetch();
            // Notification.info({ message: 'Info Page Successfully Updated.', delay: 3000 });
            //     $scope.update_page_info_model=response.data.info_pages[0];
            //    console.log( $scope.update_page_info_model);
        }, function myError(response) {
            console.log('err');
        });
    }



    $scope.onSelectBannerChange = function (val) {



        if (val == "home_page_banner") {

            var src = $("#l_image").attr('src').replace($("#l_image").attr('src'), "uploads/banner/1.jpg");
            $("#l_image").attr('src', src);

            var src2 = $("#l_image_pop_up").attr('src').replace($("#l_image_pop_up").attr('src'), "uploads/banner/1.jpg");
            $("#l_image_pop_up").attr('src', src2);
        }
        else if (val == "listing_banner_2") {

            var src = $("#l_image").attr('src').replace($("#l_image").attr('src'), "uploads/banner/2.jpg");
            $("#l_image").attr('src', src);
            var src2 = $("#l_image_pop_up").attr('src').replace($("#l_image_pop_up").attr('src'), "uploads/banner/2.jpg");
            $("#l_image_pop_up").attr('src', src2);
        }
        else if (val == "listing_background_banner") {

            var src = $("#l_image").attr('src').replace($("#l_image").attr('src'), "uploads/banner/3.jpg");
            $("#l_image").attr('src', src);
            var src2 = $("#l_image_pop_up").attr('src').replace($("#l_image_pop_up").attr('src'), "uploads/banner/3.jpg");
            $("#l_image_pop_up").attr('src', src2);
        }
        else {
            var src = $("#l_image").attr('src').replace($("#l_image").attr('src'), "uploads/banner/logo.jpg");
            $("#l_image").attr('src', src);
            var src2 = $("#l_image_pop_up").attr('src').replace($("#l_image_pop_up").attr('src'), "uploads/banner/logo.jpg");
            $("#l_image_pop_up").attr('src', src2);

        }

    }


    /*** Till BANNER */



    /**********Add Layout Info IN Admin ****/

    $scope.layout = {};

    $scope.save_layout = function (layout) {

        console.log(layout);

        var str = layout.layout_type;

        $scope.u.layout_type = layout.layout_type;
        $scope.u.layout_status = layout.layout_status;
        $scope.u.banner_id = layout.layout_banner_assign._id;
        $scope.u.banner_name = layout.layout_banner_assign.banner_name;


        var sms_template;
        String.prototype.replaceAll = function (target, replacement) {
            return this.split(target).join(replacement);
        };

        sms_template = layout.layout_type.replaceAll("_", "-");

        $scope.u.layout_name = sms_template;

        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/add-layout-page",
            data: $scope.u
        }).then(function mySucces(response) {

            //console.log(response);
            Notification.info({ message: 'Layout Successfully Added.', delay: 3000 });
            $scope.banner_detail = "";
            //    $scope.save_information_page_details = "";
        }, function myError(response) {
            console.log('err');
        });

    }

    $scope.view_layout_detail = {};
    $scope.fetch_layout_detail = function (info_id) {

        $http({
            method: "POST",
            url: "admin/fetch-layout-detail",

        }).then(function mySucces(response) {

            console.log(response.data);
            $scope.view_layout_detail = response.data;
            // console.log(response.data.info_pages);

        }, function myError(response) {
            console.log('err');
        });

    }

    var count_all_layout = false;
    $scope.checkAll_for_layout = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_layout = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_layout = false;
        }
        angular.forEach($scope.view_layout_detail, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };


    $scope.layout_page_delete = function () {


        swal({
            title: "Are you sure?",
            text: "You are going to delete Layout Detail.!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_layout == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {



                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {
                            console.log('delete all pages');
                            $scope.u = {};
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-layout-pages",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All Layout Details Are Deleted!", "success");
                                $timeout(function () {
                                    $scope.fetch_layout_detail();

                                }, 400);

                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_layout == false || $scope.hasAllCookChecked == false) {

                            console.log('delete selected layout');
                            $scope.u = {};
                            $scope.u.selected_layout_page = $scope.selection;
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            console.log($scope.u);
                            $http({
                                method: "POST",
                                url: "admin/delete-selected-layout-pages",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Info Page Successfully Deleted..!", "success");
                                $scope.selection = [];
                                $timeout(function () {
                                    $scope.fetch_layout_detail();

                                }, 400);

                                // Notification.error({message: 'Info Page Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_layout == true && $scope.hasAllCookChecked == true) {
                            console.log('delete all pages');
                            $scope.u = {};
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-layout-pages",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All Layout Details Are Deleted!", "success");
                                $timeout(function () {
                                    $scope.fetch_layout_detail();

                                }, 400);

                            }, function myError(response) {
                                console.log('err');
                            });
                        }

                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete cook :)", "error");
                }
            });

    }


    $scope.selectedItemChanged_Layout = function (val) {

        swal({
            title: "Are you sure?",
            text: "You are going to Change Status of Layout!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Change it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    if ($scope.selection.length < 1 && count_all_layout == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {

                        if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == false && $scope.selection.length > 0) {

                            if (val == "Enable") {

                                console.log('Selected Enabling');
                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/enable-layout-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {

                                    $scope.selection = [];
                                    $timeout(function () {

                                        $scope.fetch_layout_detail();

                                    }, 400);
                                    swal("Changed!", "Layout Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });
                            }

                            else if (val == "Disable") {
                                console.log('Selected Disabling');
                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/disable-layout-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {
                                    $scope.selection = [];

                                    $timeout(function () {

                                        $scope.fetch_layout_detail();

                                    }, 400);
                                    swal("Changed!", "Layout Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });

                            }

                        }
                        else
                            if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == true) {

                                $scope.u = {};
                                $scope.u.admin_id = $cookieStore.get('admin_id');

                                if (val == "Enable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/enable-all-layout",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.hasAllCookChecked = false;
                                        $scope.selection = [];
                                        $timeout(function () {

                                            $scope.fetch_layout_detail();

                                        }, 400);


                                        swal("Changed!", "Layout Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });
                                }

                                else if (val == "Disable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/disable-all-layout",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.selection = [];
                                        $scope.hasAllCookChecked = false;
                                        $timeout(function () {

                                            $scope.fetch_layout_detail();

                                        }, 400);
                                        swal("Changed!", "Layout Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });

                                }

                            }





                    }
                }
                else {
                    swal("Cancelled", "Your cancelled to Change Layout Status :)", "error");
                }


            });
    }
    //         $scope.view_info_detail = {};
    // $scope.fetch_info_pages = function (info_id) {

    //     $http({
    //         method: "POST",
    //         url: "admin/fetch-info-pages",

    //     }).then(function mySucces(response) {

    //         $scope.view_info_detail = response.data.info_pages;
    //         console.log(response.data.info_pages);

    //     }, function myError(response) {
    //         console.log('err');
    //     });

    // }

    $scope.update_layout_temp = function (layout_id) {

        console.log(layout_id);

        $scope.tmp_layout_id = layout_id;
        // // console.log(tmp_coupon_id) ;
        $cookieStore.put('layout_id', $scope.tmp_layout_id);

    }

    $scope.update_layout_model = {};
    $scope.update_layout_fetch_admin = function () {

        $scope.u = {};
        $scope.u.layout_id = $cookieStore.get('layout_id');

        $http({
            method: "POST",
            url: "admin/fetch-layout-by-id",
            data: $scope.u
        }).then(function mySucces(response) {
            console.log(response.data);

            $scope.update_layout_model = response.data[0];


            if ($scope.update_layout_model.layout_type == "home_page_banner") {

                var src = $("#l_image").attr('src').replace($("#l_image").attr('src'), "uploads/banner/1.jpg");
                $("#l_image").attr('src', src);

                var src2 = $("#l_image_pop_up").attr('src').replace($("#l_image_pop_up").attr('src'), "uploads/banner/1.jpg");
                $("#l_image_pop_up").attr('src', src2);
            }
            else if ($scope.update_layout_model.layout_type == "listing_banner_2") {

                var src = $("#l_image").attr('src').replace($("#l_image").attr('src'), "uploads/banner/2.jpg");
                $("#l_image").attr('src', src);
                var src2 = $("#l_image_pop_up").attr('src').replace($("#l_image_pop_up").attr('src'), "uploads/banner/2.jpg");
                $("#l_image_pop_up").attr('src', src2);
            }
            else if ($scope.update_layout_model.layout_type == "listing_background_banner") {

                var src = $("#l_image").attr('src').replace($("#l_image").attr('src'), "uploads/banner/3.jpg");
                $("#l_image").attr('src', src);
                var src2 = $("#l_image_pop_up").attr('src').replace($("#l_image_pop_up").attr('src'), "uploads/banner/3.jpg");
                $("#l_image_pop_up").attr('src', src2);
            }
            else {
                var src = $("#l_image").attr('src').replace($("#l_image").attr('src'), "uploads/banner/logo.jpg");
                $("#l_image").attr('src', src);
                var src2 = $("#l_image_pop_up").attr('src').replace($("#l_image_pop_up").attr('src'), "uploads/banner/logo.jpg");
                $("#l_image_pop_up").attr('src', src2);

            }

            // console.log($scope.layout);
        }, function myError(response) {
            console.log('err');
        });
    }
    $scope.update_layout_page = function () {


        $scope.u = {};

        //  $scope.u = $scope.update_layout_model;
        $scope.u.layout_id = $cookieStore.get('layout_id');
        $scope.u.layout_type = $scope.update_layout_model.layout_type;
        $scope.u.layout_status = $scope.update_layout_model.layout_status;
        $scope.u.banner_id = $scope.update_layout_model.assined_banner_id;
        $scope.u.banner_name = $scope.update_layout_model.assined_banner_name;

        var sms_template;
        String.prototype.replaceAll = function (target, replacement) {
            return this.split(target).join(replacement);
        };

        sms_template = $scope.update_layout_model.layout_type.replaceAll("_", "-");

        $scope.u.layout_name = sms_template;

        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/update-layout-page",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response);

            Notification.info({ message: 'Layout Details Successfully Updated.', delay: 3000 });
            $scope.update_layout_fetch();
            //     $scope.update_page_info_model=response.data.info_pages[0];
            //    console.log( $scope.update_page_info_model);
        }, function myError(response) {
            console.log('err');
        });

    }





    /*** Till Layout */




    /********** Template email and sms IN ADMIN ****/
    $scope.sms_temp_detail = {};
    $scope.email_temp_detail = {};

    $scope.sms_temp = function (val) {

        console.log(val);
        var cursorPos = $('#mail_body').prop('selectionStart');
        console.log(cursorPos);
        var v = $('#mail_body').val();
        var textBefore = v.substring(0, cursorPos);
        var textAfter = v.substring(cursorPos, v.length);
        $('#mail_body').val(textBefore + val + textAfter);


    }

    $scope.email_temp_body = function (val) {


        var cursorPos = $('#mail_body_email').prop('selectionStart');
        console.log(cursorPos);
        var v = $('#mail_body_email').val();
        var textBefore = v.substring(0, cursorPos);
        var textAfter = v.substring(cursorPos, v.length);
        $('#mail_body_email').val(textBefore + val + textAfter);

        console.log($('#mail_body_email').val());
    }

    $scope.email_temp_subj = function (val) {


        var cursorPos = $('#mail_body_subj').prop('selectionStart');
        console.log(cursorPos);
        var v = $('#mail_body_subj').val();
        var textBefore = v.substring(0, cursorPos);
        var textAfter = v.substring(cursorPos, v.length);
        $('#mail_body_subj').val(textBefore + val + textAfter);

        console.log($('#mail_body_subj').val());
    }

    $scope.basic_sms_template = "Hi \n\nThank you for your order! \n\nPlease find below, the summary of your order We will send you another email once the items in your order have been shipped. Meanwhile, you can check the status of your order on EatoEato "

    $scope.sms_temp_save = function () {

        $scope.u = {};
        $scope.u.admin_id = $cookieStore.get('admin_id');
        $scope.u.sms_type = $scope.sms_temp_detail.order_detail;
        $scope.u.sms_body = $('#mail_body').val();
        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/save-sms-template",
            data: $scope.u
        }).then(function mySucces(response) {
            Notification.info({ message: 'SMS Template Successfully Added..', delay: 3000 });

            $scope.sms_temp_detail = "";

        }, function myError(response) {
            console.log('err');
        });
    }


    $scope.save_template_name = function (val) {
        $cookieStore.put('templ_view_name', val);
    }

    $scope.fetch_template_by_name = function () {

        $scope.u.temp_view_id = $cookieStore.get('templ_view_name');

        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/fetch-template-by-type",
            data: $scope.u
        }).then(function mySucces(response) {
            //    Notification.info({ message: 'SMS Template Successfully Added..', delay: 3000 });
            console.log(response.data);
            if (response.data.hasOwnProperty('status')) {
                Notification.error({ message: 'No Record Found', delay: 3000 });
                console.log('No record found')
            }
            else {
                $scope.basic_sms_template = response.data.sms_template;
                $scope.sms_temp_detail.order_detail = response.data.sms_type;
                console.log('we have data');
            }

        }, function myError(response) {
            console.log('err');
        });
    }

    $scope.fetch_sms_template_on_select = function (val) {

        $scope.u.temp_view_id = val;

        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/fetch-template-by-type",
            data: $scope.u
        }).then(function mySucces(response) {
            //    Notification.info({ message: 'SMS Template Successfully Added..', delay: 3000 });
            console.log(response.data);
            if (response.data.hasOwnProperty('status')) {
                console.log('No record found')
                Notification.error({ message: 'No Record Found', delay: 3000 });
                $scope.basic_sms_template = "Hi \n\nThank you for your order! \n\nPlease find below, the summary of your order We will send you another email once the items in your order have been shipped. Meanwhile, you can check the status of your order on EatoEato "

            }
            else {
                $scope.basic_sms_template = response.data.sms_template;
                $scope.sms_temp_detail.order_detail = response.data.sms_type;
                console.log('we have data');
            }

        }, function myError(response) {
            console.log('err');
            console.log(val);
        });
    }

    $scope.email_temp_save = function () {

        $scope.u = {};
        $scope.u.admin_id = $cookieStore.get('admin_id');
        $scope.u.email_type = $scope.email_temp_detail.email_type;
        $scope.u.email_subj = $('#mail_body_subj').val();
        $scope.u.email_body = $('#mail_body_email').val();
        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/save-email-template",
            data: $scope.u
        }).then(function mySucces(response) {
            Notification.info({ message: 'Email Template Successfully Added..', delay: 3000 });

            //$scope.sms_temp_detail="";

        }, function myError(response) {
            console.log('err');
        });
    }

    $scope.fetch_email_template_by_name = function () {

        $scope.u.temp_view_id = $cookieStore.get('templ_view_name');

        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/fetch-email-template-by-type",
            data: $scope.u
        }).then(function mySucces(response) {
            //    Notification.info({ message: 'SMS Template Successfully Added..', delay: 3000 });
            console.log(response.data);
            if (response.data.hasOwnProperty('status')) {
                Notification.error({ message: 'No Record Found', delay: 3000 });
                console.log('No record found')
            }
            else {
                $scope.email_temp_detail.mail_subj = response.data.email_subj;
                $scope.basic_sms_template = response.data.email_body;
                $scope.email_temp_detail.email_type = response.data.email_type;
                console.log('we have data');
            }

        }, function myError(response) {
            console.log('err');
        });
    }

    $scope.fetch_email_template_on_select = function (val) {

        $scope.u.temp_view_id = val;

        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/fetch-email-template-by-type",
            data: $scope.u
        }).then(function mySucces(response) {
            //    Notification.info({ message: 'SMS Template Successfully Added..', delay: 3000 });
            console.log(response.data);
            if (response.data.hasOwnProperty('status')) {
                console.log('No record found')
                Notification.error({ message: 'No Record Found', delay: 3000 });
                $scope.basic_sms_template = "Hi \n\nThank you for your order! \n\nPlease find below, the summary of your order We will send you another email once the items in your order have been shipped. Meanwhile, you can check the status of your order on EatoEato "

            }
            else {
                $scope.basic_sms_template = response.data.sms_template;
                $scope.sms_temp_detail.order_detail = response.data.sms_type;
                console.log('we have data');
            }

        }, function myError(response) {
            console.log('err');
            console.log(val);
        });
    }

    /*** Till Template */

    /**********Add Cateogories Info IN ADMIN ****/
    $scope.category_status_show = false;
    $scope.category_banner_show = false;
    $scope.complete_category_saved = false;

    $scope.category_details = {};

    $scope.save_categories_infos = function (category_details_info) {
        $scope.u = {};
        $scope.u = category_details_info;
        $scope.u.cat_img = $scope.categoryImageData;
        $scope.u.cat_banner = $scope.categoryBannerData;
        // console.log(category_details_info);


        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/add-product-category",
            data: $scope.u
        }).then(function mySucces(response) {

            $scope.category_details = "";
            $scope.categoryImageData = "";
            $scope.categoryBannerData = "";
            $scope.complete_category_saved = true;

            Notification.info({ message: 'New Cusine Added.', delay: 3000 });


        }, function myError(response) {
            console.log('err');
        });
    }

    $scope.user_profile_image_status = false;

    $scope.categoryImageData = "";
    $scope.categoryBannerData = "";


    $scope.upload_cateogory_image = function (files) {

        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('category-image').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            $scope.categoryImageData = $base64.encode(data);
            //console.log($scope.imageData);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);

    }

    $scope.upload_cateogory_banner = function (files) {

        if (files[0] == undefined) return;
        $scope.fileExt = files[0].name.split(".").pop();

        var f = document.getElementById('category-banner').files[0];


        r = new FileReader();

        r.onloadend = function (e) {

            var data = e.target.result;

            $scope.categoryBannerData = $base64.encode(data);
            //console.log($scope.imageData);

            //send your binary data via $http or $resource or do anything else with it


        }

        r.readAsBinaryString(f);

    }





    // FOR ATTRIBUTE OPERATIONS

    $scope.att_group_details = {};
    $scope.add_atribute_group = function (details) {

        $http({
            method: "POST",
            url: "admin/add-attribute-group",
            data: $scope.att_group_details
        }).then(function mySucces(response) {

            console.log(response);
            //    $scope.category_details="";
            //  $scope.complete_category_saved=true;

            //         $timeout( function()
            //      {

            //         $scope.complete_category_saved=false;

            //         }, 3000);


        }, function myError(response) {
            console.log('err');
        });

    }


    $scope.view_attribute_group = {};
    $scope.fetch_attribute_group = function (info_id) {

        $http({
            method: "GET",
            url: "admin/fetch-attribute-group",

        }).then(function mySucces(response) {

            console.log(response.data);
            $scope.view_attribute_group = response.data;
            // console.log(response.data.info_pages);

        }, function myError(response) {
            console.log('err');
        });

    }

    var count_all_attr_group = false;
    $scope.checkAll_attr_group = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_attr_group = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_attr_group = false;
        }
        angular.forEach($scope.view_attribute_group, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };

    $scope.details_for_group = {};
    $scope.fetch_attr_group_name = function () {

        $http({
            method: "GET",
            url: "admin/fetch-attr-group-name"

        }).then(function mySucces(response) {

            $scope.details_for_group = response.data;
            console.log(response.data);

        }, function myError(response) {
            console.log('err');
        });
    }




    $scope.attr_group_delete = function () {


        swal({
            title: "Are you sure?",
            text: "You are going to delete Attribute Group.!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_attr_group == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {



                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {
                            console.log('delete all pages');

                            swal("Blocked!", "This Function is Blocked because it is dependent on other modules!", "warning");
                            $timeout(function () {

                            }, 400);

                        }
                        if ($scope.selection.length > 0 && count_all_attr_group == false || $scope.hasAllCookChecked == false) {
                            $scope.u = {};
                            $scope.u.selected_attr_group = $scope.selection;
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            $http({
                                method: "POST",
                                url: "admin/delete-selected-attr-group",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Attribute Group Successfully Deleted..!", "success");
                                $scope.selection = [];
                                $timeout(function () {
                                    $scope.fetch_attr_group_name();

                                }, 400);

                                // Notification.error({message: 'Info Page Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_attr_group == true && $scope.hasAllCookChecked == true) {
                            console.log('delete all pages');
                            swal("Blocked!", "This Function is Blocked because it is dependent on other modules!", "warning");
                            $timeout(function () {

                            }, 400);

                        }

                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete Atribute Group :)", "error");
                }
            });

        // console.log($scope.selection);


    };

    $scope.update_attyr_group_temp = function (attr_group_id) {

        console.log(attr_group_id);

        $scope.attr_group_id = attr_group_id;
        // // console.log(tmp_coupon_id) ;
        $cookieStore.put('temp_id', $scope.attr_group_id);

    }


    //$scope.update_attr_group_view={};
    $scope.update_attyr_group_fetch = function () {

        $scope.u.attr_group_id = $cookieStore.get('temp_id');

        $http({
            method: "POST",
            url: "admin/fetch-attr-group-by-id",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response);
            $scope.att_group_details = response.data[0];
            // console.log($scope.update_layout_model);
        }, function myError(response) {
            console.log('err');
        });
    }



    $scope.update_attr__model = {};
    $scope.update_layout_fetch = function () {

        $scope.u = {};
        $scope.u.layout_id = $cookieStore.get('layout_id');

        $http({
            method: "POST",
            url: "admin/fetch-layout-by-id",
            data: $scope.u
        }).then(function mySucces(response) {


            $scope.update_layout_model = response.data.layout_pages[0];
            console.log($scope.update_layout_model);
        }, function myError(response) {
            console.log('err');
        });
    }



    // $scope.update_layout_page = function () {


    //     $scope.u = {};

    //     $scope.u = $scope.update_layout_model;
    //     console.log($scope.u);
    //     $http({
    //         method: "POST",
    //         url: "admin/update-layout-page",
    //         data: $scope.u
    //     }).then(function mySucces(response) {

    //         console.log(response);

    //         Notification.info({ message: 'Layout Details Successfully Updated.', delay: 3000 });
    //           $scope.update_layout_fetch();
    //         //     $scope.update_page_info_model=response.data.info_pages[0];
    //         //    console.log( $scope.update_page_info_model);
    //     }, function myError(response) {
    //         console.log('err');
    //     });

    // }


    // ATTRIBUTE FIELDS INFO

    $scope.attr_fields_details = {};
    $scope.save_group_att_fields = function (ff) {
        $scope.u = {};
        $scope.u.f_name = ff.f_name;
        $scope.u.g_name = ff.g_name.group_name;
        $scope.u.sort_order = ff.sort_order;
        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/save-attr-field-name",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response);

        }, function myError(response) {
            console.log('err');
        });
    }


    $scope.view_attr_field = {};
    $scope.fetch_attribute = function () {

        $http({
            method: "GET",
            url: "admin/fetch-attribute-list-detail",

        }).then(function mySucces(response) {

            // console.log(response.data.groupname);
            var temp = [];
            for (var i = 0; i < response.data.length; i++) {

                for (var j = 0; j < response.data[i].attr_fields.length; j++) {

                    var obj = {};

                    obj.group_attr = response.data[i].attr_fields[j].group_attr;
                    obj._id = response.data[i].attr_fields[j]._id;

                    temp.push(obj);
                }
            }
            $scope.view_attr_field = temp;
            console.log(temp);
        }, function myError(response) {
            console.log('err');
        });

    }


    var count_all_attr_fields = false;
    $scope.checkAll_for_attr_fields = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_attr_fields = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_attr_fields = false;
        }
        angular.forEach($scope.view_attr_field, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };



    $scope.attr_group_fields_delete = function () {


        swal({
            title: "Are you sure?",
            text: "You are going to delete Attribute Fields.!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_attr_fields == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {



                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {
                            console.log('delete all pages');

                            swal("Blocked!", "This Function is Blocked because it is dependent on other modules!", "warning");
                            $timeout(function () {

                            }, 400);

                        }
                        if ($scope.selection.length > 0 && count_all_attr_fields == false || $scope.hasAllCookChecked == false) {
                            $scope.u = {};
                            $scope.u.selected_attr_field = $scope.selection;
                            $scope.u.admin_id = $cookieStore.get('admin_id');
                            $http({
                                method: "POST",
                                url: "admin/delete-selected-attr-field",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Attribute Field Successfully Deleted..!", "success");
                                $scope.selection = [];
                                $timeout(function () {
                                    $scope.fetch_attribute();

                                }, 400);

                                // Notification.error({message: 'Info Page Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_attr_fields == true && $scope.hasAllCookChecked == true) {
                            console.log('delete all pages');
                            swal("Blocked!", "This Function is Blocked because it is dependent on other modules!", "warning");
                            $timeout(function () {

                            }, 400);

                        }

                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete Atribute Field :)", "error");
                }
            });



        // $scope.update_attr__model = {};
        // $scope.update_layout_fetch = function () {

        //     $scope.u = {};
        //     $scope.u.layout_id = $cookieStore.get('layout_id');

        //     $http({
        //         method: "POST",
        //         url: "admin/fetch-layout-by-id",
        //         data: $scope.u
        //     }).then(function mySucces(response) {


        //         $scope.update_layout_model = response.data.layout_pages[0];
        //         console.log($scope.update_layout_model);
        //     }, function myError(response) {
        //         console.log('err');
        //     });
        // }


    }


    $scope.update_attr_field_temp = function (attr_field_id) {

        console.log(attr_field_id);

        $scope.attr_field_id = attr_field_id;
        // // console.log(tmp_coupon_id) ;
        $cookieStore.put('temp_id', $scope.attr_field_id);

    }


    $scope.update_attr_field_fetch = function () {

        $scope.u = {};
        $scope.u.attr_id = $cookieStore.get('temp_id');

        $http({
            method: "POST",
            url: "admin/fetch-attr-field-by-id",
            data: $scope.u
        }).then(function mySucces(response) {

            $scope.attr_fields_details = response.data[0];
            //  $scope.update_layout_model = response.data.layout_pages[0];
            console.log(response.data[0]);
        }, function myError(response) {
            console.log('err');
        });


    }

    $scope.update_attr_field_final = function (val) {

        $scope.u = {};
        $scope.u = val;
        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/update-attr-field-by-id",
            data: $scope.u
        }).then(function mySucces(response) {

            //   $scope.attr_fields_details=response.data[0];
            //  $scope.update_layout_model = response.data.layout_pages[0];
            // console.log(response.data[0]);
        }, function myError(response) {
            console.log('err');
        });

    }


    // TILL ATTRIBUTE FIELDS INFO

    // SERVICE CENTER OPERATIONS


    $scope.service_center_detail = {};


    $scope.add_service_center = function (data) {


        $scope.u = {};
        $scope.u = data;

        $scope.u = {};
        $scope.u = data;

        console.log($scope.u);
        $http({
            method: "POST",
            url: "admin/add-service-center",
            data: $scope.u
        }).then(function mySucces(response) {
            $scope.service_center_detail = "";
            Notification.info({ message: 'New Service Center Successfully Added.', delay: 3000 });

            $timeout(function () {
                $location.path('/admin/view-service-center');

            }, 3000);
        }, function myError(response) {
            console.log('err');
        });
        console.log($scope.u);




        //   if($scope.ser_cen_loc.hasOwnProperty('lat')){

        //       $scope.u={};
        //         $scope.u=data;
        //         $scope.u.center_lat=$("#lat").val();
        //         $scope.u.center_long=$("#long").val();
        //          console.log($scope.u);
        //               $http({
        //     method: "POST",
        //     url: "admin/add-service-center",
        //     data: $scope.u
        // }).then(function mySucces(response) {
        //     $scope.service_center_detail="";
        //     Notification.info({ message: 'New Service Center Successfully Added.', delay: 3000 });

        // }, function myError(response) {
        //     console.log('err');
        // });

        //  }
        //  else{

        //         $scope.u={};
        //         $scope.u=data;

        //          $scope.u={};
        //         $scope.u=data;
        //         $scope.u.center_lat=$("#lat").val();
        //         $scope.u.center_long=$("#long").val();
        //          console.log($scope.u);
        //               $http({
        //     method: "POST",
        //     url: "admin/add-service-center",
        //     data: $scope.u
        // }).then(function mySucces(response) {
        //     $scope.service_center_detail="";
        //     Notification.info({ message: 'New Service Center Successfully Added.', delay: 3000 });

        //           $timeout(function () {
        //                        $location.path('/admin/view-service-center');

        //                         }, 3000);
        // }, function myError(response) {
        //     console.log('err');
        // });
        //         console.log($scope.u);  

        //  }

    }



    $scope.ser_cen_loc = {};

    $scope.GetServiceCenterAddress = function () {


        var win = window.open('https://www.google.co.in/maps/place/New+Delhi,+Delhi/@28.5272181,77.068898,11z/data=!3m1!4b1!4m5!3m4!1s0x390cfd5b347eb62d:0x52c2b7494e204dce!8m2!3d28.6139391!4d77.2090212?hl=en', '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }
        //  Notification.warning({ message: 'Please Wait For A While..', delay: 500 });
        //         var tt = "";
        //         $scope.locate_val = "Test Me";

        //         if (navigator.geolocation) {

        //             navigator.geolocation.getCurrentPosition(function (p) {
        //                 LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
        //                 var mapOptions = {
        //                     center: LatLng,
        //                     zoom: 13,
        //                     mapTypeId: google.maps.MapTypeId.ROADMAP
        //                 };
        //                 GetAddress(p.coords.latitude, p.coords.longitude, LatLng);
        //                 $scope.ser_cen_loc.lat=p.coords.latitude;
        //                 $scope.ser_cen_loc.long=p.coords.longitude;

        //       $("#lat").val(p.coords.latitude);
        //        $("#long").val(p.coords.longitude);
        //                 console.log(p.coords.latitude);
        //                 console.log(p.coords.longitude);



        //             });
        //         } else {
        //             alert('Geo Location feature is not supported in this browser.');

        //         }

        //         function GetAddress(lat, lng, add) {

        //             var geocoder = geocoder = new google.maps.Geocoder();
        //             geocoder.geocode({ 'latLng': add }, function (results, status) {

        //                 if (status == google.maps.GeocoderStatus.OK) {
        //                     if (results[1]) {

        //                          setTimeout(function () {
        //                   swal({
        //                     title: "Location Captured",
        //                     text: results[0].address_components[2].short_name,
        //                     type: "success",
        //                     confirmButtonText: "OK"
        //                 },
        //                     function (isConfirm) {
        //                         if (isConfirm) {

        //                         }
        //                     });
        //             }, 100);
        //                         // results[0].address_components[1].short_name+','+

        //                         tt = results[0].address_components[2].short_name;
        //                         //	console.log(results[0].address_components[1].short_name+','+results[0].address_components[2].long_name);
        //                         $("#location").text(tt);
        //                         $("#autocomplete").val(results[1].formatted_address);


        //                         //                        
        //                         console.log(tt);
        //                     }
        //                 }
        //             });
        //         }



    }

    $scope.view_service_center = {};
    $scope.fetch_service_center = function (info_id) {
        console.log('FETCHING');
        $http({
            method: "POST",
            url: "admin/fetch-service-center-all",

        }).then(function mySucces(response) {

            $scope.view_service_center = response.data.service_center_info;
            console.log($scope.view_service_center);

        }, function myError(response) {
            console.log('err');
        });

    }


    var count_all_service_center = false;
    $scope.checkAll_for_Service_center = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_service_center = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_service_center = false;
        }
        angular.forEach($scope.view_service_center, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };



    $scope.service_center_delete = function () {


        swal({
            title: "Are you sure?",
            text: "You are going to delete Service Center .!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_service_center == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {



                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {

                            $scope.u = {};

                            $http({
                                method: "POST",
                                url: "admin/delete-all-service-center",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All Info Pages Are Deleted!", "success");
                                $timeout(function () {
                                    $scope.fetch_service_center();

                                }, 400);

                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_service_center == false || $scope.hasAllCookChecked == false) {

                            $scope.u = {};
                            $scope.u.selected_service_center = $scope.selection;

                            $http({
                                method: "POST",
                                url: "admin/delete-selected-service-center",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Info Page Successfully Deleted..!", "success");
                                $scope.selection = [];
                                $timeout(function () {
                                    $scope.fetch_service_center();

                                }, 400);

                                // Notification.error({message: 'Info Page Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_service_center == true && $scope.hasAllCookChecked == true) {
                            console.log('delete all pages');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-service-center",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All Info Pages Are Deleted!", "success");

                                $timeout(function () {
                                    $scope.fetch_service_center();

                                }, 400);
                            }, function myError(response) {
                                console.log('err');
                            });
                        }

                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete cook :)", "error");
                }
            });

    }



    $scope.selectedItemChanged_ServiceCenter = function (val) {

        swal({
            title: "Are you sure?",
            text: "You are going to Change Status of Service Center!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Change it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    if ($scope.selection.length < 1 && count_all_service_center == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {

                        if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == false && $scope.selection.length > 0) {

                            if (val == "Enable") {

                                $http({
                                    method: "POST",
                                    url: "admin/enable-service-center-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {

                                    $scope.selection = [];
                                    $timeout(function () {

                                        $scope.fetch_service_center();

                                    }, 400);
                                    swal("Changed!", "Service Center Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });
                            }

                            else if (val == "Disable") {

                                $http({
                                    method: "POST",
                                    url: "admin/disable-service-center-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {
                                    $scope.selection = [];

                                    $timeout(function () {

                                        $scope.fetch_service_center();

                                    }, 400);
                                    swal("Changed!", " Service Center Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });

                            }

                        }
                        else
                            if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == true) {

                                $scope.u = {};


                                if (val == "Enable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/enable-all-service-center",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.hasAllCookChecked = false;
                                        $scope.selection = [];
                                        $timeout(function () {

                                            $scope.fetch_service_center();

                                        }, 400);


                                        swal("Changed!", " Service Center Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });
                                }

                                else if (val == "Disable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/disable-all-service-center",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.selection = [];
                                        $scope.hasAllCookChecked = false;
                                        $timeout(function () {

                                            $scope.fetch_service_center();

                                        }, 400);
                                        swal("Changed!", " Service Center Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });

                                }

                            }





                    }
                }
                else {
                    swal("Cancelled", "Your cancelled to Change Service Center Status :)", "error");
                }


            });


    }

    $scope.tmp_service_center_id;
    $scope.update_service_center_temp = function (center_id) {


        $scope.tmp_service_center_id = center_id;
        // console.log(tmp_coupon_id) ;
        $cookieStore.put('temp_global', $scope.tmp_service_center_id);

    }



    // $scope.update_details={};
    $scope.update_service_center_fetch = function (center) {

        $scope.u = {};
        $scope.u.service_center_id = $cookieStore.get('temp_global');



        $http({
            method: "POST",
            url: "admin/fetch-service-center-by-id",
            data: $scope.u
        }).then(function mySucces(response) {


            console.log(response.data.service_center_info[0]);
            $scope.service_center_detail = response.data.service_center_info[0];

        }, function myError(response) {
            console.log('err');
        });
    }


    $scope.update_service_center_details = function (center) {

        $scope.u = {};
        // $scope.u.coupon_id= $cookieStore.get('coupon_update_id');

        $scope.u = center;



        $http({
            method: "POST",
            url: "admin/update-service-center-by-id",
            data: $scope.u
        }).then(function mySucces(response) {
            Notification.success({ message: 'Service Center Successfully Updated..', delay: 3000 });

            $timeout(function () {
                $cookieStore.remove("temp_global");
                $location.path('/admin/view-service-center');

            }, 1000);
        }, function myError(response) {
            console.log('err');
        });
    }


    // DELIVERY BOY OPERATIONS


    $scope.c_list = {};

    $scope.fetch_service_center_for_delivery_boy = function (info_id) {

        $http({
            method: "POST",
            url: "admin/fetch-service-center-all",

        }).then(function mySucces(response) {
            $scope.c_list = response.data.service_center_info;
            // $scope.delivery_boy_details.service_center_list = response.data.service_center_info;
            console.log($scope.c_list);

        }, function myError(response) {
            console.log('err');
        });

    }

    $scope.add_delivery_boy = function (data) {

        console.log(data);


        $scope.u = {};
        $scope.u = data;

        $http({
            method: "POST",
            url: "admin/add-delivery-boy",
            data: $scope.u
        }).then(function mySucces(response) {
            $scope.delivery_boy_details = "";
            Notification.info({ message: 'Delivery Boy Successfully Added.', delay: 3000 });

        }, function myError(response) {
            console.log('err');
        });

    }

    $scope.view_delivery_boy = {};

    $scope.fetch_delivery_boy_all = function (boy) {

        $http({
            method: "POST",
            url: "admin/fetch-delivery-boy-all",

        }).then(function mySucces(response) {

            $scope.view_delivery_boy = response.data.delivery_boy_info;
            console.log($scope.view_delivery_boy);

        }, function myError(response) {
            console.log('err');
        });

    }

    var count_all_delivery_boy = false;
    $scope.checkAll_for_delivery_boy = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_delivery_boy = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_delivery_boy = false;
        }
        angular.forEach($scope.view_delivery_boy, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };

    $scope.delivery_boy_delete = function () {


        swal({
            title: "Are you sure?",
            text: "You are going to delete Delivery Boy.!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_delivery_boy == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {



                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {

                            $scope.u = {};

                            $http({
                                method: "POST",
                                url: "admin/delete-all-delivery-boy",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All  Delivery Boys Are Deleted!", "success");
                                $timeout(function () {
                                    $scope.fetch_delivery_boy_all();

                                }, 400);

                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_delivery_boy == false || $scope.hasAllCookChecked == false) {

                            $scope.u = {};
                            $scope.u.selected_delivery_boy = $scope.selection;

                            $http({
                                method: "POST",
                                url: "admin/delete-selected-delivery-boy",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Delivery Boy Successfully Deleted..!", "success");
                                $scope.selection = [];
                                $timeout(function () {
                                    $scope.fetch_delivery_boy_all();

                                }, 400);

                                // Notification.error({message: 'Info Page Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_delivery_boy == true && $scope.hasAllCookChecked == true) {
                            console.log('delete all pages');
                            $http({
                                method: "POST",
                                url: "admin/delete-all-delivery-boy",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All Delivery Boys Are Deleted!", "success");

                                $timeout(function () {
                                    $scope.fetch_delivery_boy_all();

                                }, 400);
                            }, function myError(response) {
                                console.log('err');
                            });
                        }

                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete Delivery Boy :)", "error");
                }
            });

    }


    $scope.tmp_service_center_id;
    $scope.update_delivery_boy_temp = function (boy_id) {


        $scope.tmp_del_boy_id = boy_id;
        // console.log(tmp_coupon_id) ;
        $cookieStore.put('temp_global', $scope.tmp_del_boy_id);

    }



    // $scope.update_details={};
    $scope.update_delivery_boy_fetch = function (center) {

        $scope.u = {};
        $scope.u.delivery_boy_id = $cookieStore.get('temp_global');

        $http({
            method: "POST",
            url: "admin/fetch-delivery-boy-by-id",
            data: $scope.u
        }).then(function mySucces(response) {


            console.log(response.data);
            $scope.delivery_boy_details = response.data.delivery_boy_info[0];
            console.log($scope.delivery_boy_details.service_center_name);
            //  $scope.delivery_boy_details.service_center_name= $scope.delivery_boy_details.service_center_name;

        }, function myError(response) {
            console.log('err');
        });


    }

    // Cuisine OPERATIONS

    $scope.view_cuisine_details = {};

    $scope.fetch_all_cuisine = function () {

        $http({
            method: "GET",
            url: "admin/fetch-all-cuisines",

        }).then(function mySucces(response) {

            $scope.view_cuisine_details = response.data;
            //     console.log( $scope.view_delivery_boy);
            console.log(response.data);
        }, function myError(response) {
            console.log('err');
        });

    }

    var count_all_cuisine_list = false;
    $scope.checkAll_for_cuisine = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_cuisine_list = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_cuisine_list = false;
        }
        angular.forEach($scope.view_cuisine_details, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };

    $scope.cuisine_delete = function () {


        swal({
            title: "Are you sure?",
            text: "You are going to delete Cuisine.!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_cuisine_list == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {



                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {

                            $scope.u = {};

                            $http({
                                method: "POST",
                                url: "admin/delete-all-cuisine",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                // $scope.hasAllCookChecked=false;
                                // $scope.hasAllCookChecked.selected=false;
                                swal("Deleted!", "All  Cuisines Are Deleted!", "success");
                                $timeout(function () {
                                    $scope.fetch_all_cuisine();

                                }, 400);

                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_cuisine_list == false || $scope.hasAllCookChecked == false) {

                            $scope.u = {};
                            $scope.u.selected_cuisine = $scope.selection;

                            $http({
                                method: "POST",
                                url: "admin/delete-selected-cuisine",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Cuisine Successfully Deleted..!", "success");
                                $scope.selection = [];
                                $timeout(function () {
                                    $scope.fetch_all_cuisine();

                                }, 400);


                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_cuisine_list == true && $scope.hasAllCookChecked == true) {

                            $http({
                                method: "POST",
                                url: "admin/delete-all-cuisine",
                                data: $scope.u
                            }).then(function mySucces(response) {


                                swal("Deleted!", "All Cuisines Are Deleted!", "success");

                                $timeout(function () {
                                    $scope.fetch_all_cuisine();

                                }, 400);
                            }, function myError(response) {
                                console.log('err');
                            });
                        }

                    }

                } else {
                    swal("Cancelled", "Your cancelled to delete Cuisines :)", "error");
                }
            });

    }

    $scope.selectedItemChanged_Cuisine = function (val) {

        swal({
            title: "Are you sure?",
            text: "You are going to Change Status of Cuisine!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Change it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    if ($scope.selection.length < 1 && count_all_cuisine_list == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {

                        if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == false && $scope.selection.length > 0) {

                            if (val == "Enable") {

                                console.log('Selected Enabling');
                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/enable-cuisine-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {

                                    $scope.selection = [];
                                    $timeout(function () {

                                        $scope.fetch_all_cuisine();

                                    }, 400);
                                    swal("Changed!", "Cuisine Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });
                            }

                            else if (val == "Disable") {
                                console.log('Selected Disabling');
                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/disable-cuisine-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {
                                    $scope.selection = [];

                                    $timeout(function () {

                                        $scope.fetch_all_cuisine();

                                    }, 400);
                                    swal("Changed!", "Cuisine Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });

                            }

                        }
                        else
                            if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == true) {

                                $scope.u = {};
                                $scope.u.admin_id = $cookieStore.get('admin_id');

                                if (val == "Enable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/enable-all-cuisine",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.hasAllCookChecked = false;
                                        $scope.selection = [];
                                        $timeout(function () {

                                            $scope.fetch_all_cuisine();

                                        }, 400);


                                        swal("Changed!", "Cuisine Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });
                                }

                                else if (val == "Disable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/disable-all-cuisine",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.selection = [];
                                        $scope.hasAllCookChecked = false;
                                        $timeout(function () {

                                            $scope.fetch_all_cuisine();

                                        }, 400);
                                        swal("Changed!", "Cuisine Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });

                                }

                            }





                    }
                }
                else {
                    swal("Cancelled", "Your cancelled to Change Cuisine Status :)", "error");
                }


            });


    }

    $scope.tmp_service_center_id;
    $scope.update_cuisine_temp = function (boy_id) {


        $scope.tmp_cuisine_id = boy_id;
        // console.log(tmp_coupon_id) ;
        $cookieStore.put('temp_global', $scope.tmp_cuisine_id);

    }



    $scope.update_cuisine_details = {};
    $scope.update_cuisine_fetch = function (center) {

        $scope.u = {};
        $scope.u.cuisine_id = $cookieStore.get('temp_global');

        $http({
            method: "POST",
            url: "admin/fetch-cuisine-by-id",
            data: $scope.u
        }).then(function mySucces(response) {


            console.log(response.data);
            $scope.category_details = response.data;
            // console.log($scope.delivery_boy_details.service_center_name);
            //  $scope.delivery_boy_details.service_center_name= $scope.delivery_boy_details.service_center_name;

        }, function myError(response) {
            console.log('err');
        });


    }


    $scope.update_cuisine_details = function (cuisine) {

        $scope.u = {};
        // $scope.u.coupon_id= $cookieStore.get('coupon_update_id');

        $scope.u = cuisine;



        $http({
            method: "POST",
            url: "admin/update-cuisine-by-id",
            data: $scope.u
        }).then(function mySucces(response) {

            console.log(response);
            // Notification.success({ message: 'Service Center Successfully Updated..', delay: 3000 });

            //    $timeout(function () {
            //         $cookieStore.remove("temp_global");
            //                                 $location.path('/admin/view-service-center');

            //                             }, 1000);
        }, function myError(response) {
            console.log('err');
        });
    }

    //Till Cuisine OPERATIONS



    // FOOD OPERATIONS


    $scope.view_food_listing = {};
    $scope.fetch_food_listing_all = function () {

        $http({
            method: "GET",
            url: "admin/fetch-all-cook-foods",

        }).then(function mySucces(response) {

            console.log(response.data);

            $scope.view_food_listing = response.data;
            // Notification.success({ message: 'Service Center Successfully Updated..', delay: 3000 });

            //    $timeout(function () {
            //         $cookieStore.remove("temp_global");
            //                                 $location.path('/admin/view-service-center');

            //                             }, 1000);
        }, function myError(response) {
            console.log('err');
        });
    }



    $scope.tmp_food_id;
    $scope.update_food_temp = function (food_id) {


        $scope.tmp_food_id = food_id;
        // console.log(tmp_coupon_id) ;
        $cookieStore.put('temp_global', $scope.tmp_food_id);
        console.log($cookieStore.get('temp_global'));
    }



    $scope.update_food_details_admin = {};
    $scope.sel_for_oc_update = [];
    $scope.sel_for_cu_update = [];

    $scope.update_food_fetch = function () {

        $scope.u = {};
        $scope.u.food_id = $cookieStore.get('temp_global');

        $http({
            method: "POST",
            url: "admin/fetch-food-by-id",
            data: $scope.u
        }).then(function mySucces(response) {



            $scope.update_food_details_admin = response.data[0];
            $scope.sel_for_oc_update = response.data[0].occassion_list;
            $scope.sel_for_cu_update = response.data[0].cuisine_list;

            console.log(response.data[0]);

            setTimeout(
                function () {

                    for (var i = 0; i < $scope.update_food_details_admin.cuisine_list.length; i++) {

                        if ($scope.update_food_details_admin.cuisine_list[i].status == "true") {

                            $scope.modernBrowsers[i].ticked = true;

                        }
                        else {
                            $scope.modernBrowsers[i].ticked = false;
                            //  console.log($scope.modernBrowsers[i]);
                        }

                    }
                }, 400);

            // console.log($scope.delivery_boy_details.service_center_name);
            //  $scope.delivery_boy_details.service_center_name= $scope.delivery_boy_details.service_center_name;

        }, function myError(response) {
            console.log('err');
        });


    }


    $scope.occ_list = {};
    $scope.veg_list = {};

    $scope.get_occassion_and_veg_type_admin = function () {

        $http({
            method: "GET",
            url: "cook/get-occ-veg-list",

        }).then(function mySucces(response) {

            $scope.veg_list = response.data[1].attr_fields;
            $scope.occ_list = response.data[0].attr_fields;

            $rootScope.selection_for_occasion = $scope.occ_list;
            console.log($scope.veg_list);

        }, function myError(response) {


        });
    }


    $scope.toggleSelection_for_occ_update_admin = function (val) {


        var idx = $scope.selection.indexOf(val);

        // is currently selected
        if (idx > -1) {

            $scope.selection.splice(idx, 1);
            console.log($scope.selection);
        }

        // is newly selected
        else {
            // val.status='true';
            // $scope.selection.push(val);
            var len = $scope.sel_for_oc_update.length;
            for (var i = 0; i < len; i++) {

                if ($scope.sel_for_oc_update[i].group_attr == val.group_attr && $scope.sel_for_oc_update[i].status == 'false') {

                    $scope.sel_for_oc_update[i].status = 'true';
                }
                else if ($scope.sel_for_oc_update[i].group_attr == val.group_attr && $scope.sel_for_oc_update[i].status == 'true') {

                    $scope.sel_for_oc_update[i].status = 'false';
                } else {

                }
            }

            console.log($scope.sel_for_oc_update);
            //  $scope.food_details.occassion_list = $scope.sel_for_oc_update;
        }
    }

    $scope.cuisine_name_list_admin = {};
    $scope.fetch_cuisine_name = function (social_details) {


        $http({
            method: "GET",
            url: "admin/fetch-cuisine-name",

        }).then(function mySucces(response) {

            for (var i = 0; i < response.data.length; i++) {
                var send = {
                    "name": response.data[i].category_name,
                    ticked: false
                };
                $scope.cuisine_name_list.push(send);


            }

            // console.log($scope.cuisine_name_list);


        }, function myError(response) {
            console.log('err');
        });
    }
    $scope.modernBrowsers = $scope.cuisine_name_list;


    $scope.update_food_details_by_admin = function (food) {

        $scope.u = {};
        // $scope.u.coupon_id= $cookieStore.get('coupon_update_id');

        $scope.u.update_food_details = food;

        console.log($scope.u);

        // $http({
        //     method: "POST",
        //     url: "admin/update-food-by-id-admin",
        //     data: $scope.u
        // }).then(function mySucces(response) {

        //     Notification.success({ message: 'Food Details Successfully Updated..', delay: 3000 });

        //     //    $timeout(function () {
        //     //         $cookieStore.remove("temp_global");
        //     //                                 $location.path('/admin/view-service-center');

        //     //                             }, 1000);
        // }, function myError(response) {
        //     console.log('err');
        // });

    }


    var count_all_food = false;
    $scope.checkAll_for_food = function () {

        if ($scope.hasAllCookChecked) {

            $scope.hasAllCookChecked = true;
            count_all_food = true;
        } else {
            $scope.selection = [];
            $scope.hasAllCookChecked = false;
            count_all_food = false;
        }
        angular.forEach($scope.view_food_listing, function (item) {
            item.selected = $scope.hasAllCookChecked;
        });

    };

    $scope.food_delete = function () {


        swal({
            title: "Are you sure?",
            text: "You are going to delete Food Details.!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {


                    if ($scope.selection.length < 1 && count_all_food == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {



                        if ($scope.selection.length < 1 && $scope.hasAllCookChecked == true) {

                            swal("Sorry!", "You Can't Delete All Foods", "error");
                            setTimeout(
                                function () {
                                    $scope.fetch_food_listing_all();

                                }, 400);
                            // $scope.u = {};
                            // $scope.u.admin_id = $cookieStore.get('admin_id');
                            // $http({
                            //     method: "POST",
                            //     url: "admin/delete-all-food",
                            //     data: $scope.u
                            // }).then(function mySucces(response) {

                            //     $scope.hasAllCookChecked = false;
                            //     $scope.hasAllCookChecked.selected = false;
                            //     swal("Deleted!", "All Foods Are Deleted!", "success");

                            //     $scope.fetch_coupon();
                            // }, function myError(response) {
                            //     console.log('err');
                            // });
                        }
                        if ($scope.selection.length > 0 && count_all_food == false || $scope.hasAllCookChecked == false) {

                            $scope.u.selected_food = $scope.selection;


                            $http({
                                method: "POST",
                                url: "admin/delete-selected-food",
                                data: $scope.u
                            }).then(function mySucces(response) {

                                swal("Deleted!", "Food Successfully Deleted..!", "success");
                                $scope.selection = [];
                                setTimeout(
                                    function () {
                                        $scope.fetch_food_listing_all();

                                    }, 400);

                                // Notification.error({message: 'Cook Successfully Deleted..', delay: 3000});
                            }, function myError(response) {
                                console.log('err');
                            });
                        }
                        if ($scope.selection.length > 0 && count_all_food == true && $scope.hasAllCookChecked == true) {
                            swal("Sorry!", "You Can't Delete All Foods", "error");
                            setTimeout(
                                function () {
                                    $scope.fetch_food_listing_all();

                                }, 400);

                            // $scope.u = {};
                            // $scope.u.admin_id = $cookieStore.get('admin_id');
                            // $http({
                            //     method: "POST",
                            //     url: "admin/delete-all-food",
                            //     data: $scope.u
                            // }).then(function mySucces(response) {

                            //     $scope.hasAllCookChecked = false;
                            //     $scope.hasAllCookChecked.selected = false;
                            //     swal("Deleted!", "All Foods Are Deleted!", "success");

                            //     $scope.fetch_coupon();
                            // }, function myError(response) {
                            //     console.log('err');
                            // });
                        }

                    }




                } else {
                    swal("Cancelled", "Your cancelled to delete Food :)", "error");
                }
            });

        // console.log($scope.selection);


    };

    $scope.selectedItemChanged_Food = function (val) {

        swal({
            title: "Are you sure?",
            text: "You are going to Change Status of Food!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Change it!",
            cancelButtonText: "No, cancel plz!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    if ($scope.selection.length < 1 && count_all_food == false) {
                        sweetAlert("Oops...", "No Checkbox Selected!", "error");
                    }
                    else {

                        if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == false && $scope.selection.length > 0) {

                            if (val == "Enable") {


                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/enable-food-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {

                                    $scope.selection = [];
                                    $timeout(function () {

                                        $scope.fetch_food_listing_all();

                                    }, 400);
                                    swal("Changed!", "Food Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });
                            }

                            else if (val == "Disable") {
                                console.log('Selected Disabling');
                                console.log($scope.selection);
                                $http({
                                    method: "POST",
                                    url: "admin/disable-layout-by-id",
                                    data: $scope.selection
                                }).then(function mySucces(response) {
                                    $scope.selection = [];

                                    $timeout(function () {

                                        $scope.fetch_layout_detail();

                                    }, 400);
                                    swal("Changed!", "Layout Status Successfully Changed..!", "success");
                                }, function myError(response) {
                                    console.log('err');
                                });

                            }

                        }
                        else
                            if ($scope.hasAllCookChecked == undefined || $scope.hasAllCookChecked == true) {

                                $scope.u = {};
                                $scope.u.admin_id = $cookieStore.get('admin_id');

                                if (val == "Enable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/enable-all-layout",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.hasAllCookChecked = false;
                                        $scope.selection = [];
                                        $timeout(function () {

                                            $scope.fetch_layout_detail();

                                        }, 400);


                                        swal("Changed!", "Layout Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });
                                }

                                else if (val == "Disable") {


                                    console.log($scope.selection);
                                    $http({
                                        method: "POST",
                                        url: "admin/disable-all-layout",
                                        data: $scope.u
                                    }).then(function mySucces(response) {
                                        $scope.selection = [];
                                        $scope.hasAllCookChecked = false;
                                        $timeout(function () {

                                            $scope.fetch_layout_detail();

                                        }, 400);
                                        swal("Changed!", "Layout Status Successfully Changed..!", "success");
                                    }, function myError(response) {
                                        console.log('err');
                                    });

                                }

                            }





                    }
                }
                else {
                    swal("Cancelled", "Your cancelled to Change Layout Status :)", "error");
                }


            });
    }


    // TILL FOOD OPERATIONS






}]);


//my account tabs active class add
(function () {
    angular.module('autoActive', ['ngCookies', 'ckeditor', '720kb.datepicker', 'base64', 'ngFileUpload', 'rzModule', 'angular-loading-bar', 'ui-notification', 'angularUtils.directives.dirPagination', 'isteven-multi-select', 'ngSanitize','ngStorage' ])
        .directive('autoActive', ['$location', function ($location) {
            return {
                restrict: 'A',
                scope: false,
                link: function (scope, element) {
                    function setActive() {
                        var path = $location.path();
                        if (path) {
                            angular.forEach(element.find('.list'), function (li) {
                                var anchor = li.querySelector('a');
                                // if (anchor.href.match('#' + path + '(?=\\?|$)')) {
                                //     angular.element(li).addClass('active');
                                // } else {
                                //     angular.element(li).removeClass('active');
                                // }
                            });
                        }
                    }

                    setActive();

                    scope.$on('$locationChangeSuccess', setActive);
                }
            }
        }])

        .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
            cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
            cfpLoadingBarProvider.includeBar = true;

        }])
        .config(function (NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 4000,
                startTop: 20,
                startRight: 10,
                verticalSpacing: 20,
                horizontalSpacing: 20,
                positionX: 'right',
                positionY: 'top'
            });
        });

} ());
