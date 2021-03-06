var myApp = angular.module("mavyApp", ['ngRoute', 'ngCookies', 'ngStorage', 'ngFacebook', 'ui.mask', 'ui.bootstrap', 'angular-bind-html-compile', 'ngSanitize', 'angular-bootstrap-select', 'ngSlimScroll']);

myApp.config(function($routeProvider, $httpProvider, $facebookProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'signup.html',
			controller: 'signupCtrl'
        })
		.when('/signup', {
            templateUrl: 'createUser.html',
			controller: 'createUserCtrl'
        })
		.when('/dashboard', {
            templateUrl: 'home.html',
			controller: 'indexCtrl'
        })
		.when('/pollresults', {
            templateUrl: 'results.html',
			controller: 'pollResultCtrl'
        })
		.when('/assignment', {
            templateUrl: 'assignments.html',
			controller: 'assignmentCtrl'
        }).when('/assignments/showAssignment', {
            templateUrl: 'showassignments.html',
			controller: 'showassignmentCtrl'
        })
		.when('/forum', {
            templateUrl: 'forum.html',
			controller: 'forumCtrl'
        })
		.when('/forum/:forumId', {
            templateUrl: 'forum.html',
			controller: 'forumCtrl'
        })
		.when('/messages', {
            templateUrl: 'message.html',
			controller: 'messagesCtrl'
        })
		.when('/messages/:conversationId', {
            templateUrl: 'messageConversation.html',
			controller: 'messageconversationCtrl'
        })
		.when('/profile', {
            templateUrl: 'profile.html',
			controller: 'profileCtrl'
        })
		.when('/notification', {
            templateUrl: 'notifications.html',
			controller: 'notificationCtrl'
        })
		.when('/resetpassword', {
            templateUrl: 'resetpassword.html',
			controller: 'resetpasswordCtrl'
        })
		.when('/rewards', {
            templateUrl: 'rewards.html',
			controller: 'rewardsCtrl'
        })
        .when('/badges', {
            templateUrl: 'badges.html',
			controller: 'badgesCtrl'
        })
		.otherwise({
            redirectTo: '/'
        });
		
		$facebookProvider.setAppId('1588022388118943');
	})

.run(function($rootScope){
		(function(){
		if (document.getElementById('facebook-jssdk')) {return;}
		var firstScriptElement = document.getElementsByTagName('script')[0];
		var facebookJS = document.createElement('script');
		facebookJS.id = 'facebook-jssdk';
		facebookJS.src = 'http://connect.facebook.net/en_US/sdk.js';
		firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
		}());
	});
	
myApp.controller('createUserCtrl', function($scope, $location){
	var endpoints = {};
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.signUp = function(){
		if($scope.password !== $scope.cpassword){
			alert("Passwords Do not match");
		}
		else{
			// var attributes = [{'name': 'email', 'value': $scope.uemail}, {'name': 'username', 'value': $scope.uname}, {'name': 'password', 'value': $scope.password}];
			
			var attributes = [{"name": "username","value": "Akash_19"},{"name": "email","value": "akash19@sampatti.com"},{"name": "bdate","value": "4/15/1980"},{"name": "gend","value": "M"},{ "name": "education","value": "edu_7"},{"name": "hispanic","value": "No"},{"name": "ethnicitymultichoice","value": "s6_2::"},{"name": "kidsunder18","value": "Yes"},{ "name": "zipc","value": "60607"},{"name": "state", "value": "IL"},{"name": "region","value": "Midwest"},{"name": "income","value": "s9_5"},{"name": "employmentmultichoice","value": "s10_1::s10_2::s10_3::s10_6::"},{"name": "employmentcensus","value": "s10_1"},{"name": "signupmethod","value": "CreateUser"},{"name": "src","value": "src_5"},{"name": "fname","value": "Diego"},{"name": "lname","value": "C"},{"name": "cellphone","value": "773-123-1234"},{"name": "otpdelivery","value": "1"},{"name": "password", "value": "admin@123"}];


			endpoints.mobileHandler.createUser(attributes, function(result){
				alert(result.result.message);
				$scope.password = '';
				$scope.cpassword = '';
				$scope.uemail = '';
				$scope.uname = '';
				$location.path('/');
				$scope.$apply();
			});
		}
	}
});

myApp.controller('signupCtrl', function($scope, $rootScope, $location, $cookieStore, $localStorage, $timeout, $window, $facebook, $modal, $route){
	$scope.sign={'uname':'','password':''};
	$rootScope.uname = '';
	if ($localStorage.loggedIn) {
		$('body').addClass('dashboard_pages');
		$location.path('/dashboard');

	}
	var endpoints = {};
	$scope.newArray = [];
	endpoints.apiKey = "835mzggn289l9wxnjxjr323kny6q";
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.login = function(){
		$scope.userSysteminfo = [];
		if($scope.sign.uname && $scope.sign.password){
			endpoints.mobileHandler.login($scope.sign.uname, $scope.sign.password, $scope.userSysteminfo, function(result){
				debugger;
				if(result.result.success){
					$scope.isLoggedIn = true;
					$cookieStore.put('userName', $scope.sign.uname);
					$localStorage.loggedIn = true;
					$localStorage.userName = $scope.sign.uname;
					debugger;
					$localStorage.loginDetails = result.result.result;
					$scope.sign.uname = '';
					$scope.sign.password = '';
					$('body').addClass('dashboard_pages');
					$location.path('/dashboard');
					$scope.$apply();
				}
				else{
					$scope.sign.uname = '';
					$scope.sign.password = '';
					$location.path('/');
					$scope.$apply();
				}
			});
		}
	};
	
	$scope.fbLogin = function(){
		$scope.userSystemInfo = [];
		$facebook.login().then(function(result){
			debugger;
			if(result.status){
				$scope.accessToken = result.authResponse.accessToken;
				$scope.userId = result.authResponse.userID;
				endpoints.mobileHandler.loginFb($scope.accessToken, $scope.userSystemInfo, function(response){
					if(response.result.success){
						$localStorage.loggedIn = true;
						$localStorage.userName = response.result.result[4].value;
						$localStorage.userDetails = {"userId": $scope.userId, "logindetails": response.result.result};
						$location.path('/dashboard');
						$scope.$apply();
					}
					else{
						alert(response.result.message);
						$location.path('/');
					}
				});
			}
		}, {scope: "email"});
	};
});

myApp.controller('signupModalctrl', function($scope, $modalInstance, $facebook, $location, $localStorage, accessToken, userId){
	$scope.ok = function () {
		var endpoints = {};
		$scope.newArray = [];
		endpoints.mobileHandler = new MobileHandler();
		$scope.username = $scope.displayname;
		$scope.token = accessToken;
		$scope.userId = userId;
		$scope.userSystemInfo = [];
		endpoints.mobileHandler.loginFb($scope.token, $scope.userSystemInfo, function(response){
			if(response.result.success){
				$localStorage.loggedIn = true;
				$localStorage.userName = $scope.username;
				$localStorage.loginDetails = response.result.result;
				$localStorage.userDetails = {"userId": $scope.userId, "logindetails": response.result.result};
				$location.path('/dashboard');
				$scope.$apply();
			}
			else{
				alert(response.result.message);
				$location.path('/');
			}
		});
		$modalInstance.dismiss('cancel');
	};

	$scope.cancel = function (){
		$modalInstance.dismiss('cancel');
	};
});

myApp.controller('indexCtrl', function($scope, $cookieStore, $rootScope, $localStorage, $location){

	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	$rootScope.settings = false;
	$rootScope.rewards = false;
	$rootScope.badges = false;
	$('body').addClass('dashboard_pages');
	$scope.feedActive = true;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	$scope.allAssignments = [];
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.tempArray = [];
	$scope.allPolls = [];
	$scope.recentMessages = [];
	$scope.model = '';
    $scope.colors = ['Mustard', 'Ketchup', 'Relish'];
    $scope.repeater = [
      {title: 'one'},
      {title: 'two'},
      {title: 'three'}
    ];
    $scope.selectWithOptionsIsVisible = true;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	
	endpoints.mobileHandler.getDashboard($scope.apiKey,$scope.userId,7,null,null, function(result){

	});

	$scope.showForum = function(forumId){
		$location.path('/forum/'+forumId);
	}
	
	endpoints.mobileHandler.getDashboard($scope.apiKey, $scope.userId, 1, null, null, function(result){
		if (result.result.success){			
			for (var i=0; i< result.result.result.Entries.length; i++) {
				$scope.allAssignments.push(result.result.result.Entries[i]);
			}
			$cookieStore.put('assignments', $scope.allAssignments);
		}
		$scope.$apply();
	});
	
	$scope.submitPoll = function(poll){
		var index = $scope.allPolls.indexOf(poll);
		$scope.allPolls.splice(index, 1);
		if($scope.allPolls.length <= 0){
			setTimeout(function(){
				$('.votingDone').animate({height: '0px', border: 'none', margin: '0', padding: '0'}, "500");
			}, 3000);
		}
	};	
	
	$scope.showAssignmentTasks = function(assignment){
		$('.quiz_tip').remove();
		if(assignment.modules[0].mode == 1){
			alert('This quiz can be viewed over Mavy App only!!!');
			return;		
		}
		else if(assignment.modules[0].mode == 3){
			if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
				alert('This quiz can be viewed only over desktop');
				return;
			}
			else{
				$cookieStore.put('assignment', assignment);
				$location.path('/assignments/showAssignment');
			}
		}
		else{
			$cookieStore.put('assignment', assignment);
			$location.path('/assignments/showAssignment');
		}
	};
	
	$scope.showMessage = function(message){
		$rootScope.message = message;
		$location.path('/messages/'+message.LastMessage.ConversationId);
	};
	
	$scope.showThread = function(forumId){
		$location.path('/forum-expanded/'+forumId);
	}
	
	$scope.localDate = function(date){
		var localTime  = moment.utc(date).toDate();
		localTime = moment(localTime).subtract(3,'m').format('MMMM Do YYYY, h:mm a');
		return localTime;
	}
	
	endpoints.mobileHandler.getPanelistAttributes($scope.apiKey, $scope.userId, $scope.panelistId, function(callback){
		if(callback.result.success){
			$scope.avatarUrl = callback.result.result.AvatarUrl;
			$rootScope.avatarUrl = callback.result.result.AvatarUrl;
			$scope.fname = callback.result.result.fname;
			$rootScope.fname = callback.result.result.fname;
			$scope.lname = callback.result.result.lname;
			$rootScope.lname = callback.result.result.lname;
			$rootScope.email = callback.result.result.email;
			$scope.email = callback.result.result.email;
			$scope.selectedMonth = callback.result.result.bdate.slice('/')[0];
			$scope.selectedDate = callback.result.result.bdate.slice('/')[2];
			$scope.selectedYear = callback.result.result.bdate.slice('/')[4]+callback.result.result.bdate.slice('/')[5]+callback.result.result.bdate.slice('/')[6]+callback.result.result.bdate.slice('/')[7];
			$scope.gender = callback.result.result.gend;
			$scope.zipcode = callback.result.result.zipc;
			$scope.mobileNumber = callback.result.result.cell_phone;
			$scope.options = [{"name": $scope.fname + ' ' + $scope.lname}, {"name": "KetchUp"}, {"name": "Relish"}];
			endpoints.mobileHandler.getIncentives($scope.apiKey, $scope.userId, $scope.panelistId, null, null, function(result){
				$scope.redeemable = result.result.result[result.result.result.length-1].redeemable;
				$scope.$apply();
			});
		}
	});
	
	endpoints.mobileHandler.getInbox($scope.apiKey, $scope.userId, 20, null, function(msg){
		if(msg.result.result.Conversations){
			$rootScope.msgCount = msg.result.result.Conversations.length;
			for(var i=0; i<msg.result.result.Conversations.length; i++){
				$scope.recentMessages.push(msg.result.result.Conversations[i]);
			}
			$scope.$apply();
		}	
	});


	/*********** Active Forum Threads **********/
	$scope.loadActiveThreads = function(){
		endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(forums){
			if(forums.result.result.Threads) {
				$rootScope.forumsCount=forums.result.result.Threads.length;
				$rootScope.allForums=forums.result.result.Threads;
				for(var i=0; i<$rootScope.allForums.length; i++){   
					$scope.tempArray.push($rootScope.allForums[i]);
				}
			}
			$scope.$apply();
		});
	};

	if($rootScope.allForums){
		for(var i=0; i<$rootScope.allForums.length; i++){
			$scope.tempArray.push($rootScope.allForums[i]);
		}
	}
	else {
		$scope.loadActiveThreads();
	}
	/*********** ./Active Forum Threads **********/
});

myApp.controller('pollsCtrl', function($scope, $rootScope, $location, $localStorage, $cookieStore, $filter){
	
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	$('body').addClass('dashboard_pages');
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.incrementedVal=0;
	$scope.stopRecursiveCall = false;
	$scope.tempArray = [];
	$scope.allPolls = []; 
	$rootScope.polesForResults= [];
	$rootScope.dataforResults = [];
	$rootScope.totalPollsResults = [];
	$scope.resultCalculated = [];
	if(!$rootScope.deletedPolls)
		$rootScope.deletedPolls = [];
	if(!$rootScope.deletedUnusedPolls)
		$rootScope.deletedUnusedPolls = [];
	$rootScope.pollforResults = [];
	$rootScope.pollforvotes = [];
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	
	endpoints.mobileHandler.getDashboard($scope.apiKey, $scope.userId, 5, null, null, function(result){
		if(result.result.success){
			// for(var i=0; i<result.result.result.Entries.length; i++){
				// $rootScope.polesForResults.push(result.result.result.Entries[i]);
			// }
			$rootScope.totalPollsResults = [];
			$scope.recursiveCall(result);
		}
		$scope.$apply();
	});
	
	$scope.recursiveCall = function(result){
		$scope.results = result.result.result.Entries;
		if($scope.results.length > 0){
			if($scope.incrementedVal < $scope.results.length){
				$scope.checkPolls(result);
			}
		}
	};
	
	$scope.checkPolls = function(result){
		endpoints.mobileHandler.getPanelistPollResponses($scope.apiKey, $scope.userId,$scope.panelistId,result.result.result.Entries[$scope.incrementedVal].taskId, function(response){
			if(response.result.success){
				if(response.result.result.length >0){
					/* Poll has been already voted */
					/* Going to display results for the above array */
					endpoints.mobileHandler.getPollResponseCounts($scope.apiKey, $scope.userId, result.result.result.Entries[$scope.incrementedVal].taskId, function(voteCounts){
						if(voteCounts.result.success){
							for(var i=0; i<result.result.result.Entries.length; i++){
								if(result.result.result.Entries[i]){
									if(voteCounts.result.result.length>0){
										debugger;
										if($rootScope.deletedPolls.length > 0){
											if($.inArray(result.result.result.Entries[i].itemId, $rootScope.deletedPolls) == -1){
												if(result.result.result.Entries[i].itemId == voteCounts.result.result[0].itemId){
													for(var j=0; j<result.result.result.Entries[i].options.categories.length; j++){
														if(voteCounts.result.result[0].values[j]){
															for(var p=0; p<voteCounts.result.result[0].values.length; p++){
																if(voteCounts.result.result[0].values[p].value == result.result.result.Entries[i].options.categories[j].values){
																	voteCounts.result.result[0].values[p].count = Math.round((voteCounts.result.result[0].values[p].count /voteCounts.result.result[0].responseCount)*100);
																	$scope.pollforResults.push({'count': voteCounts.result.result[0].values[p].count, 'category': result.result.result.Entries[i].options.categories[j].description});
																}
															}
														}
														else{
															$scope.pollforResults.push({'count': '0', 'category': result.result.result.Entries[i].options.categories[j].description});
														}
													}
												}
											}
										}
										else{
											if(result.result.result.Entries[i].itemId == voteCounts.result.result[0].itemId){
												for(var j=0; j<result.result.result.Entries[i].options.categories.length; j++){
													if(voteCounts.result.result[0].values[j]){
														for(var p=0; p<voteCounts.result.result[0].values.length; p++){
															if(voteCounts.result.result[0].values[p].value == result.result.result.Entries[i].options.categories[j].values){
																voteCounts.result.result[0].values[p].count = Math.round((voteCounts.result.result[0].values[p].count /voteCounts.result.result[0].responseCount)*100);
																$scope.pollforResults.push({'count': voteCounts.result.result[0].values[p].count, 'category': result.result.result.Entries[i].options.categories[j].description});
															}
														}
													}
													else{
														$scope.pollforResults.push({'count': '0', 'category': result.result.result.Entries[i].options.categories[j].description});
													}
												}
											}
										}
									}
								}
							}

							if($scope.pollforResults.length > 0)
								$rootScope.dataforResults.push({'pollresults': $scope.pollforResults, 'pollTitle': result.result.result.Entries[$scope.incrementedVal].pollTitle, 'itemId': result.result.result.Entries[$scope.incrementedVal].itemId});
							$scope.incrementedVal = $scope.incrementedVal + 1;
							$rootScope.pollforResults = [];
							$scope.recursiveCall(result);
							$scope.$apply();
						}
					});
				}
				else{
					/* Poll has not been voted yet */
					if(!$rootScope.deletedUnusedPolls)
						$rootScope.pollforvotes.push(result.result.result.Entries[$scope.incrementedVal]);
					else{
						if($.inArray(result.result.result.Entries[$scope.incrementedVal].itemId, $rootScope.deletedUnusedPolls) == -1){
							$rootScope.pollforvotes.push(result.result.result.Entries[$scope.incrementedVal]);
						}
					}
					debugger;
					$scope.incrementedVal = $scope.incrementedVal + 1;
					$scope.recursiveCall(result);
					$scope.$apply();
				}
			}
		});
	};
	
	$scope.submitPoll = function(pollDetails, pollvote){
		$scope.notes = [];
		$scope.value = [];
		$scope.allVotes = [];
		//$scope.allPolls = $rootScope.pollforvotes;
		debugger;
		var value = $('input[name=\"pollvote'+pollDetails.itemId+'\"]:checked').val();
		$('input[name="pollCheck"]:checked').each(function(){
			$scope.value.push($(this).val());
		});	
		
		$scope.value.push(value);
		
		for(var i=0; i<$rootScope.pollforvotes.length; i++){
			if($rootScope.pollforvotes[i].itemId == pollDetails.itemId){
				$scope.allPolls = $rootScope.pollforvotes[i];
			}
		}
		debugger;
		var response = {"projectId": $scope.allPolls.projectId, "moduleId": $scope.allPolls.moduleId, "taskId": $scope.allPolls.taskId, "itemId": $scope.allPolls.itemId, "isTestData": false, "notes": $scope.notes, "values": $scope.value};
		
		/* For saving the poll response */
		endpoints.mobileHandler.savePollResponse($scope.apiKey, $scope.userId, $scope.panelistId, response, function(result){
			if(result.result.success){
				for(var i=0; i<$rootScope.pollforvotes.length; i++){
					if($rootScope.pollforvotes[i].itemId == $scope.allPolls.itemId){
						$('#anm'+$scope.allPolls.itemId).animate({'height':0,'margin':0,'padding':0},{
							easing: 'swing',
							duration: 500,
							complete: function(){
								$('#anm'+$scope.allPolls.itemId).remove();
								$rootScope.pollforvotes.splice(i, 1);
							}
						});
					}
				}
				$scope.$apply();
			}
		});
	};
	
	$scope.animateDiv = function(id){
		$('#anm'+id).animate({'height':0,'margin':0,'padding':0},{
		 easing: 'swing',
		 duration: 500,
		 complete: function(){
				$('#anm'+id).remove();
				for(var i=0; i<$rootScope.pollforvotes.length; i++){
					if($rootScope.pollforvotes[i].itemId == id){
						$rootScope.deletedUnusedPolls.push($rootScope.pollforvotes[i].itemId);
						//$rootScope.deletedPolls.push($rootScope.pollforvotes[i]);
						$rootScope.pollforvotes.splice(i, 1);
					}
				}
				$scope.$apply();
			}
		});
	};
	
	$scope.animateResults = function(id){
		$('#results'+id).animate({'height':0,'margin':0,'padding':0},{
		 easing: 'swing',
		 duration: 500,
		 complete: function(){
				$('#results'+id).remove();
				for(var i=0; i<$rootScope.dataforResults.length; i++){
					if($rootScope.dataforResults[i].itemId == id){
						$rootScope.deletedPolls.push($rootScope.dataforResults[i].itemId);
						delete $rootScope.dataforResults[i].pollresults;
					}
				}
				$scope.$apply();
			}
		});
	};	
	
	$scope.applyBackground = function(itemId, index){
		endpoints.mobileHandler.getPanelistPollResponses($scope.apiKey, $scope.userId,$scope.panelistId,itemId, function(response){
			if(response.result.success){
				if(response.result.result.length > 0){
					if(response.result.result[0].responses[0].values[0] == index +1){
						$('#result-poll-'+ index).css({'background': '#9193c1','border-radius': '50%','color': '#fff','display': 'inline-block',
													    'height': '35px',
													    'min-width': '35px',
													    'padding-top': '7px',
													    'text-align': 'center',
													    'vertical-align': 'middle'});
						return true;
					}
				}
			}
		});
	};
});

myApp.controller('pollResultCtrl', function($scope, $location, $rootScope, $localStorage, $cookieStore){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	
	$scope.resultPolls = [];
	$scope.panelistResults = $rootScope.allVotes;
	$scope.displayPollresults = $rootScope.dataforResults;
	$scope.displayPollTotalResults = $cookieStore.get('totalPollCounts');
	
	$scope.applyBackground = function(itemId, index){
		endpoints.mobileHandler.getPanelistPollResponses($scope.apiKey, $scope.userId,$scope.panelistId,itemId, function(response){
			if(response.result.success){
				if(response.result.result.length > 0){
					if(response.result.result[0].responses[0].values[0] == index +1){
						$('#results-poll-'+ itemId + '-' + index).css({'background': '#9193c1'});
						return true;
					}
				}
			}
		});
	}	
});

myApp.controller('navCtrl', function($scope, $cookieStore, $rootScope, $location, $localStorage, $timeout, $route){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	};
	
	$scope.initializeTooltip = function(){
		$('.tooltip').tooltipster({
			maxWidth: 300
		});
	}
	
	// $scope.showHideImages = function() {
		// $scope.Active = false;
		// $scope.Assignments = false;
	// }
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	$scope.redeemable = [];
	$scope.recentMessages = [];
	$scope.model = '';
    $scope.colors = ['Mustard', 'Ketchup', 'Relish'];
    $scope.repeater = [
      { title: 'one' },
      { title: 'two' },
      { title: 'three' }
    ];
    $scope.selectWithOptionsIsVisible = true;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	
	// endpoints.mobileHandler.getDashboard($scope.apiKey, $scope.userId, 1, null, null, function(assignments){
		// if (assignments.result.success){
			// debugger;
			// $rootScope.assignmentsCounts = assignments.result.result.TotalCount;
			// $scope.$apply();
		// }
	// });
	
	endpoints.mobileHandler.getAssignments($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		if (result.result.success)
			$rootScope.assignmentsCounts = result.result.result.length;
		$scope.$apply();
	});

	
	endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(forums){
		if(forums.result.result.Threads) {
			if($location.$$url == '/forum'){
				$rootScope.forumsCount = 0;
			}
			else{
				$rootScope.forumsCount = forums.result.result.Threads.length;
				$rootScope.allForums=forums.result.result.Threads;
			}
			$scope.$apply();
		}
	});
	endpoints.mobileHandler.getInbox($scope.apiKey, $scope.userId, 20, null, function(msg){
		if(msg.result.result.Conversations){
			$scope.messageCount = [];
			for(var i=0; i<msg.result.result.Conversations.length; i++){
				if(msg.result.result.Conversations[i].HasRead != true){
					$scope.messageCount.push(msg.result.result.Conversations[i]);
				}
				$scope.recentMessages.push(msg.result.result.Conversations[i]);
			}
			$rootScope.msgCount = $scope.messageCount.length;
			$scope.$apply();
		}	
	});
	
	endpoints.mobileHandler.getPanelistAttributes($scope.apiKey, $scope.userId, $scope.panelistId, function(callback){
		if(callback.result.success){
			$scope.avatarUrl = callback.result.result.AvatarUrl;
			$rootScope.avatarUrl = callback.result.result.AvatarUrl;
			$scope.fname = callback.result.result.fname;
			$rootScope.fname = callback.result.result.fname;
			$scope.lname = callback.result.result.lname;
			$rootScope.lname = callback.result.result.lname;
			$rootScope.email = callback.result.result.email;
			$scope.email = callback.result.result.email;
			$scope.selectedMonth = callback.result.result.bdate.slice('/')[0];
			$scope.selectedDate = callback.result.result.bdate.slice('/')[2];
			$scope.selectedYear = callback.result.result.bdate.slice('/')[4]+callback.result.result.bdate.slice('/')[5]+callback.result.result.bdate.slice('/')[6]+callback.result.result.bdate.slice('/')[7];
			$scope.gender = callback.result.result.gend;
			$scope.zipcode = callback.result.result.zipc;
			$scope.mobileNumber = callback.result.result.cell_phone;
			$scope.options = [{"name": $scope.fname + ' ' + $scope.lname}, {"name": "KetchUp"}, {"name": "Relish"}];
			endpoints.mobileHandler.getIncentives($scope.apiKey, $scope.userId, $scope.panelistId, null, null, function(result){
				$scope.redeemable = result.result.result[result.result.result.length-1].redeemable;
				$scope.$apply();
			});
		}
	});
	
	endpoints.mobileHandler.getIncentives($scope.apiKey, $scope.userId, $scope.panelistId, 20, null, function(result){
		$scope.redeemable = result.result.result[result.result.result.length-1].redeemable;
		$scope.$apply();
	});
	
	$scope.logout = function() {
		$rootScope.initialized = false;
		delete $localStorage.userName;
		delete $localStorage.loggedIn;
		delete $localStorage.loginDetails;
		$location.path('/');
	};
	
	$scope.dropChange = function(model){
		if(model == 'logout'){
			$scope.logout();
		}
	};
	
	$scope.showHideimages = function(item){
		switch(item){
			case 'Home':
				$scope.feedActive = true;
				$scope.assignmentActive = false;
				$scope.forumActive = false;
				$scope.messagesactive = false;
				$location.path('/');
				break;
			case 'Assignment':
				$scope.feedActive = false;
				$scope.assignmentActive = true;
				$scope.forumActive = false;
				$scope.messagesactive = false;
				$location.path('/assignment');
				break;
			case 'Forum':
				$scope.feedActive = false;
				$scope.assignmentActive = false;
				$scope.forumActive = true;
				$scope.messagesactive = false;
				break;
			case 'Messages':
				$scope.feedActive = false;
				$scope.assignmentActive = false;
				$scope.forumActive = false;
				$scope.messagesactive = true;
				break;
		}
	}
	
});

myApp.controller('assignmentCtrl', function($scope, $location, $cookieStore, $localStorage, $rootScope){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	$rootScope.settings = false;
	$rootScope.rewards = false;
	$rootScope.badges = false;
	
	$scope.feedActive = false;
	$scope.assignmentActive = true;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	// $scope.initializeSlider = function() {
		// setTimeout(function(){
			// $scope.showAssignments = true;
			// $('.bxslider').bxSlider({
			  // auto: true,
			  // autoHover: true
			// });
		// }, 1500);
	// }
	$rootScope.forumActive = false;
	$rootScope.messagesactive = false;
	$rootScope.feedActive = false;
	$rootScope.assignmentActive = true;
	$scope.allAssignments = [];
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	$scope.featuredAssignment = [];
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	//Querying APi for response using endpoints
	endpoints.mobileHandler.getAssignments($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		 if (result.result.success){
			 for (var i=0; i< result.result.result.length; i++) {
				 $scope.allAssignments.push(result.result.result[i]);
			 }
		
		 }
		 $scope.$apply();
	 });
	
/*	endpoints.mobileHandler.getDashboard($scope.apiKey, $scope.userId, 1, null, null, function(result){
		if (result.result.success){
			
			for (var i=0; i< result.result.result.Entries.length; i++) {
				$scope.allAssignments.push(result.result.result.Entries[i]);
				if(result.result.result.Entries[i].modules[0].options.featured == 1){
					$scope.featuredAssignment.push(result.result.result.Entries[i]);
				}
			}
		}
		$scope.$apply();
	});*/
	
	$scope.showAssignmentTasks = function(assignment){
		$('.quiz_tip').remove();
		if(assignment.mode == 1){
			alert('This quiz can be viewed over Mavy App only!!!');
				return;		
		}
		else if(assignment.mode == 3){
			if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
				alert('This quiz can be viewed only over desktop');
				return;
			}
			else{
				$cookieStore.put('assignment', assignment);
				$location.path('/assignments/showAssignment');
			}
		}
		else{
			$cookieStore.put('assignment', assignment);
			$location.path('/assignments/showAssignment');
		}
	};
	
});

 myApp.controller('showassignmentCtrl', function($scope, $cookieStore, $rootScope, $location, $localStorage, $sce, $window, $route){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	$rootScope.settings = false;
	$rootScope.rewards = false;
	$rootScope.badges = false;
	
	$scope.displayName = $localStorage.userName;
	$scope.showIframe = false;
	$scope.feedActive = false;
	$scope.showPolls = false;
	$scope.showResults = false;
	$scope.assignmentActive = true;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	
	$scope.i = 0;
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.tempArray = [];
	$scope.allPolls = [];
	$scope.tasks = [];
	$scope.displayTasks = [];
	$scope.allReplies = [];
	$scope.childReplies = [];
	$scope.showChildComments= false;
	$scope.repliesCards = false;
	$scope.showReplyBox = false;
	$scope.showComments = false;
	$scope.showReplyBoxforComments = false;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.assignment = $cookieStore.get('assignment');
	$scope.projectId = $scope.assignment.projectId;
	if($scope.assignment.modules){
		$scope.moduleId = $scope.assignment.modules[0].moduleId;
		$scope.moduleType = $scope.assignment.modules[0].moduleType;
	}
	else{
		$scope.moduleId = $scope.assignment.moduleId;
		$scope.moduleType = $scope.assignment.moduleType;
	}
	
	$scope.checkUserPolls = function(task){
		endpoints.mobileHandler.getPanelistPollResponses($scope.apiKey, $scope.userId, $scope.panelistId, task.TaskId, function(response){
			if(response.result.success){
				if(response.result.result.length > 0){
					$scope.showResults = true;
					endpoints.mobileHandler.getPollResponseCounts($scope.apiKey, $scope.userId, task.TaskId, function(response){
						for(var j=0; j<response.result.result[0].values.length; j++){
							for(var p=0; p<$scope.tasks[$scope.i].options.categories.length; p++){
								if(response.result.result[0].values[p]){
									if(response.result.result[0].values[p].value==(j+1)){
										response.result.result[0].values[p].count = (response.result.result[0].values[p].count /response.result.result[0].responseCount)*100;
										$scope.tasks[$scope.i].options.categories[j].values = Math.round(response.result.result[0].values[p].count);
									}
								}
								else {
									$scope.tasks[$scope.i].options.categories[p].values = 0;
								}
							}					
						}
						$scope.$apply();
					});
				}
			}		
		});
			
	};
	
	endpoints.mobileHandler.getPanelistModuleTasks($scope.apiKey, $scope.userId, $scope.projectId, $scope.moduleId, $scope.panelistId, 20, 0, function(result){
		if(result.result.result.AvailableTasks[0]){
			if(result.result.result.AvailableTasks[0].TaskTypeId == 1){
				if(result.result.result.AvailableTasks.length > 0){
					for(var i=0;i<result.result.result.AvailableTasks.length;i++){
						$scope.tasks.push(result.result.result.AvailableTasks[i]);
					}
				}
			
				if($scope.tasks.length > 0){
					endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,$scope.tasks[$scope.i].ForumThreadId,null,null,function(response){
						$scope.userAvatarUrl = response.result.result[0].Content.CreatedByUser.AvatarUrl;
						$scope.displayName = response.result.result[0].Author.DisplayName;
						$scope.displayTasks = [];
						if(response.result.result[0].Author.DisplayName == $scope.displayName){
							$scope.displayTasks.push($scope.tasks[$scope.i]);
						}
						else{
							if($scope.tasks[$scope.i].RevealBehaviorId == 1){
								$scope.displayTasks.push($scope.tasks[$scope.i]);
							}
							else if($scope.tasks[$scope.i].RevealBehaviorId == 2){
								if(response.result.result[0].Thread.HasParticipated == true)
									$scope.displayTasks.push($scope.tasks[$scope.i]);
							}
						}
						
						if($scope.displayTasks.length > 0){
							endpoints.mobileHandler.getTaskReplies($scope.apiKey,$scope.userId, $scope.projectId, $scope.moduleId, $scope.displayTasks[0].TaskId, $scope.panelistId, 20, 0, function(replies){
								if(replies.result.result[1]){
									$scope.replyCounts = replies.result.result[1].TotalCount;
									if(replies.result.success){
										for(var i=0; i<replies.result.result[1].Replies.length; i++){
											if(replies.result.result[1].Replies[i].ParentId == 0){
												$scope.allReplies.push(replies.result.result[1].Replies[i]);
											}
											$scope.childReplies.push(replies.result.result[1].Replies[i])
										}
									}
								}
								else{
									$scope.replyCounts = 0;
									$scope.allReplies = [];
									$scope.childReplies = [];
								}
								$scope.$apply();
							});
						}							
						$scope.$apply();
					});
				}
			}
			if(result.result.result.AvailableTasks[0].TaskTypeId == 2){
				$scope.showIframe = false;
				$scope.showPolls = true;
				if(result.result.result.AvailableTasks.length > 0){
					for(var i=0;i<result.result.result.AvailableTasks.length;i++){
						$scope.tasks.push(result.result.result.AvailableTasks[i]);
					}
				}
				$scope.checkUserPolls($scope.tasks[$scope.i]);
			}
		}
		else{
			debugger;
			if($scope.assignment.modules){
				$scope.showIframe = true;
				$scope.iframeSource = $scope.assignment.modules[0].options.baseSurveyLink + $scope.panelistId;
			}
			else{
				if($scope.assignment.options.baseSurveyLink){
					$scope.showIframe = true;
					$scope.iframeSource = $scope.assignment.options.baseSurveyLink + $scope.panelistId;
				}
			}
			
			$scope.iframeHeight = $window.innerHeight;
			$scope.iframeWidth = $window.innerWidth;
		}
	});

	$scope.markCompleted = function(task) {
		var reply = $('#reply').val();
		if(task.CompletedTaskCount == 0){
			var Id = 0;
		}
		else{
			Id = task.Id;
		}
		endpoints.mobileHandler.saveTaskReply($scope.apiKey,$scope.userId,$scope.projectId,$scope.moduleId,task.TaskId,$scope.panelistId,task.Id,reply,null,null, function(response){
			alert('Response Saved');
			debugger;
			$('#reply').val(' ');
			endpoints.mobileHandler.getTaskReplies($scope.apiKey,$scope.userId, $scope.projectId, $scope.moduleId, task.TaskId, $scope.panelistId, 20, 0, function(replies){
				if(replies.result.success){
					$scope.allReplies = [];
					$scope.childReplies = [];
					for(var i=0; i<replies.result.result[1].Replies.length; i++){
						if(replies.result.result[1].Replies[i].ParentId == 0){
							$scope.allReplies.push(replies.result.result[1].Replies[i]);
						}
						$scope.childReplies.push(replies.result.result[1].Replies[i])
					}
				}
				$scope.$apply();
			});
		});
	};
	
	$scope.submitSocialPolls = function(task, option) {
		var answerIds = [];
		if(task.type == "SingleChoice"){
			if($('input[name="poll"]:checked')){
				var value = $('input[name="poll"]:checked').val();
				answerIds.push(value);
			}
		}
		else{
			if($("input[name='poll']:checked")){
				$.each($("input[name='poll']:checked"), function(){
					answerIds.push($(this).val());
				});
			}
		}
		
		if(answerIds.length > 0){
			if(task){
				if(task.TaskId){
					endpoints.mobileHandler.createPollTaskVote($scope.apiKey, $scope.userId, $scope.projectId,$scope.moduleId,task.TaskId, $scope.panelistId, answerIds, function(result){
						alert('Your poll has been submitted');
						$scope.checkUserPolls(task);
					});
				}
			}
		}
	};
	
	$scope.submitChildReply = function(Id, TaskId) {
		$scope.childReplyId = Id;
		$scope.TaskId = TaskId;
		var reply = $('#replyNewChild' + Id).val();
		endpoints.mobileHandler.saveTaskReply($scope.apiKey,$scope.userId,$scope.projectId,$scope.moduleId,$scope.TaskId,$scope.panelistId,$scope.childReplyId,reply,null,null, function(response){
			$('#replyNewChild' + Id).val(' ');
			endpoints.mobileHandler.getTaskReplies($scope.apiKey,$scope.userId, $scope.projectId, $scope.moduleId, $scope.TaskId, $scope.panelistId, 20, 0, function(replies){
				if(replies.result.success){
					$scope.allReplies = [];
					$scope.childReplies = [];
					for(var i=0; i<replies.result.result[1].Replies.length; i++){
						debugger;
						if(replies.result.result[1].Replies[i].ParentId == 0){
							$scope.allReplies.push(replies.result.result[1].Replies[i]);
						}
						$scope.childReplies.push(replies.result.result[1].Replies[i]);
					}
				}
				$scope.$apply();
			});
		});
	};
	
	$scope.getNextTask = function(i) {
		debugger;
		if($scope.tasks[i].TaskStatus == 'Completed'){
			var taskId = $scope.tasks[i].TaskId;
			endpoints.mobileHandler.getNextTask($scope.apiKey,$scope.userId,$scope.projectId,$scope.moduleId,taskId,$scope.panelistId, function(response){
				var isExists;
				if(response.result.success){
					if(response.result.result){
						if($scope.tasks.length >0){
							for(var i=0; i<$scope.tasks.length; i++){
								if($scope.tasks[i].TaskId != response.result.result.TaskId){
									isExists = true;
								}
								else{
									isExists = false;
								}
							}
							if(isExists)
								$scope.tasks.push(response.result.result);
							
							if($scope.i < $scope.tasks.length){
								$scope.i = $scope.i + 1;
								endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,$scope.tasks[$scope.i].ForumThreadId,null,null,function(response){
									$scope.displayTasks = [];
									if(response.result.result[0].Author.DisplayName == $scope.displayName){
										$scope.displayTasks.push($scope.tasks[$scope.i]);
									}
									else{
										if($scope.tasks[$scope.i].RevealBehaviorId == 1){
											$scope.displayTasks.push($scope.tasks[$scope.i]);
										}
										else if($scope.tasks[$scope.i].RevealBehaviorId == 2){
											if(response.result.result[0].Thread.HasParticipated == true)
												$scope.displayTasks.push($scope.tasks[$scope.i]);
										}
									}
									
									if($scope.displayTasks.length > 0){
										endpoints.mobileHandler.getTaskReplies($scope.apiKey,$scope.userId, $scope.projectId, $scope.moduleId, $scope.displayTasks[0].TaskId, $scope.panelistId, 20, 0, function(replies){
											if(replies.result.result[1]){
												$scope.replyCounts = replies.result.result[1].TotalCount;
												if(replies.result.success){
													for(var i=0; i<replies.result.result[1].Replies.length; i++){
														if(replies.result.result[1].Replies[i].ParentId == 0){
															$scope.allReplies.push(replies.result.result[1].Replies[i]);
														}
														$scope.childReplies.push(replies.result.result[1].Replies[i])
													}
												}
											}
											else{
												$scope.replyCounts = 0;
												$scope.allReplies = [];
												$scope.childReplies = [];
											}
											$('.childComments').hide();
											$scope.showReplyBox = false;
											$scope.$apply();
										});
									}					
									$scope.$apply();
								});
								$scope.hideRightArrow = true;
							}
						}
					}
				}
				else{
					alert('There are no other tasks');
					$scope.hideRightArrow = true;
				}
				$scope.$apply();
			});
		}
		else {
			alert('The task is still not completed');
			$scope.hideLeftArrow = true;
		}
	};
	
	$scope.getNextPoll = function(i) {
		if($scope.tasks[i].TaskStatus == 'Completed'){
			$scope.i = i+1;
			if($scope.tasks[$scope.i]){
				endpoints.mobileHandler.getPanelistPollResponses($scope.apiKey, $scope.userId, $scope.panelistId, $scope.tasks[$scope.i].TaskId, function(response){
					if(response.result.success){
						if(response.result.result.length > 0){
							$scope.showResults = true;
							endpoints.mobileHandler.getPollResponseCounts($scope.apiKey, $scope.userId, $scope.tasks[$scope.i].TaskId, function(response){
								for(var j=0; j<response.result.result[0].values.length; j++){
									for(var p=0; p<$scope.tasks[$scope.i].options.categories.length; p++){
										if(response.result.result[0].values[p]){
											if(response.result.result[0].values[p].value==(j+1)){
												response.result.result[0].values[p].count = (response.result.result[0].values[p].count /response.result.result[0].responseCount)*100;
												$scope.tasks[$scope.i].options.categories[j].values = Math.round(response.result.result[0].values[p].count);
											}
										}
										else {
											$scope.tasks[$scope.i].options.categories[p].values = 0;
										}
									}					
								}
								$scope.$apply();
							});
						}
						else{
							$scope.showResults = false;
							$scope.hideRightArrow = true;
							$scope.$apply();
						}
					}
				});
			}
			else{
				$scope.i = i;
				$scope.hideLeftArrow = true;
			}
		}
		else{
			alert('Current task is not yet completed');
		}
	};
	
	$scope.getPreviousTasks = function(i) {
		var taskId = $scope.tasks[i].TaskId;
		if($scope.i > 0)
			$scope.i = $scope.i - 1;
			endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,$scope.tasks[$scope.i].ForumThreadId,null,null,function(response){
				$scope.userAvatarUrl = response.result.result[0].Content.CreatedByUser.AvatarUrl;
				$scope.displayName = response.result.result[0].Author.DisplayName;
				$scope.displayTasks = [];
				if(response.result.result[0].Author.DisplayName == $scope.displayName){
					$scope.displayTasks.push($scope.tasks[$scope.i]);
				}
				else{
					if($scope.tasks[$scope.i].RevealBehaviorId == 1){
						$scope.displayTasks.push($scope.tasks[$scope.i]);
					}
					else if($scope.tasks[$scope.i].RevealBehaviorId == 2){
						if(response.result.result[0].Thread.HasParticipated == true)
							$scope.displayTasks.push($scope.tasks[$scope.i]);
					}
				}
				if($scope.displayTasks.length > 0){
					endpoints.mobileHandler.getTaskReplies($scope.apiKey,$scope.userId, $scope.projectId, $scope.moduleId, $scope.displayTasks[0].TaskId, $scope.panelistId, 20, 0, function(replies){
						if(replies.result.result[1]){
							$scope.replyCounts = replies.result.result[1].TotalCount;
							if(replies.result.success){
								for(var i=0; i<replies.result.result[1].Replies.length; i++){
									if(replies.result.result[1].Replies[i].ParentId == 0){
										$scope.allReplies.push(replies.result.result[1].Replies[i]);
									}
									$scope.childReplies.push(replies.result.result[1].Replies[i])
								}
							}
						}
						else{
							$scope.replyCounts = 0;
							$scope.allReplies = [];
							$scope.childReplies = [];
						}
						$('.childComments').hide();
						$scope.showReplyBox = false;
						$scope.$apply();
					});
				}
				$scope.$apply();
			});
			if($scope.i == 0){
				$scope.hideRightArrow = false;
				$scope.hideLeftArrow = false;
			}
		else
			$scope.hideRightArrow = false;
			$scope.hideLeftArrow = false;
	};
	
	$scope.getPreviousPoll = function(i){
		if($scope.tasks[i-1]){
			endpoints.mobileHandler.getPanelistPollResponses($scope.apiKey, $scope.userId, $scope.panelistId, $scope.tasks[i-1].TaskId, function(response){
				if(response.result.success){
					if(response.result.result.length > 0){
						$scope.showResults = true;
						endpoints.mobileHandler.getPollResponseCounts($scope.apiKey, $scope.userId, $scope.tasks[i-1].TaskId, function(response){
							for(var j=0; j<response.result.result[0].values.length; j++){
								for(var p=0; p<$scope.tasks[$scope.i].options.categories.length; p++){
									if(response.result.result[0].values[p]){
										if(response.result.result[0].values[p].value==(j+1)){
											response.result.result[0].values[p].count = (response.result.result[0].values[p].count /response.result.result[0].responseCount)*100;
											$scope.tasks[$scope.i].options.categories[j].values = Math.round(response.result.result[0].values[p].count);
										}
									}
									else {
										$scope.tasks[$scope.i].options.categories[p].values = 0;
									}
								}					
							}
							$scope.i = i-1;
							if($scope.i == 0){
								$scope.hideRightArrow = false;
								$scope.hideLeftArrow = false;
							}
							else{
								$scope.hideLeftArrow = false;
								$scope.hideRightArrow = true;
							}
							$scope.$apply();
						});
					}
					else{
						$scope.i = i-1;
						$scope.showResults = false;
						$scope.hideRightArrow = true;
						if($scope.i == 0){
							$scope.hideRightArrow = false;
							$scope.hideLeftArrow = false;
						}
						else{
								$scope.hideLeftArrow = false;
								$scope.hideRightArrow = true;
							}
						$scope.$apply();
					}
				}
			});
		}
		else {
			$scope.i = i;
			$scope.hideRightArrow = true;
		}
	};
	
	$scope.gotoReplyBox = function(){
		if($scope.showReplyBox)
			$scope.showReplyBox = false;
		else
			$scope.showReplyBox = true;
	};
	
	$scope.showReplies = function(){
		debugger;
		if($scope.repliesCards)
			$scope.repliesCards = false;
		else
			$scope.repliesCards = true;
	};
	
	$scope.gottoChildReplyBox = function(Id, TaskId){
		if($scope.showReplyBoxforComments){
			$scope.showReplyBoxforComments = false;
			$('.childAssignment' + Id).hide();
		}
		else{
			$scope.showReplyBoxforComments = true;
			$('.childAssignment' + Id).show();
		}
		$scope.childReplyId = Id;
		$scope.TaskId = TaskId;
		//$('.childComments').hide();
	};
	
	$scope.showChildcomments = function(Id, TaskId){
		if($scope.showComments){
			$scope.showComments = false;
			$('.showchildCommentsreplies' + Id).hide();
		}
		else{
			$scope.showComments = true;
			$('.showchildCommentsreplies' + Id).show();
		}
		$scope.childReplyId = Id;
		$scope.TaskId = TaskId;
	};
	
	$scope.localDate = function(date){
		var localTime  = moment.utc(date).toDate();
		localTime = moment(localTime).subtract(3,'m').format('MMMM Do YYYY, h:mm a');
		return localTime;
	};
});

myApp.controller('forumCtrl', function($scope,$localStorage,$rootScope,$routeParams,$location, $route, $sce){
	
	$rootScope.settings = false;
	$rootScope.rewards = false;
	$rootScope.badges = false;
	$rootScope.forumsCount = 0;
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = true;
	$scope.messagesactive = false;
	$scope.activeThreads = [];
	$scope.childThreads = [];
	$scope.nextLevelChild =[];
	$scope.showChilds = false;
	
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	var endpoints = {}
	uploadedMediaUrl = ''
	uploadMediaType = '';
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	endpoints.mediaHandler = new MediaHandler();
	//var childCounter=0;

 //endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(result){
 	$scope.loadActiveThreads = function(){
		endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(forums){
			if(forums.result.result.Threads) {
			 //$rootScope.forumsCount=forums.result.result.Threads.length;
			 $rootScope.allForums=forums.result.result.Threads;
			 for(var i=0; i<$rootScope.allForums.length; i++){   
			  $scope.activeThreads.push($rootScope.allForums[i]);
			 }
			}
			$scope.$apply();
		});
		//directChild();
	};
	 
	if($rootScope.allForums){
		for(var i=0; i<$rootScope.allForums.length; i++){   
			$scope.activeThreads.push($rootScope.allForums[i]);
		}
		if($routeParams.forumId){
		  	setTimeout(function(){
		  		var fid=$routeParams.forumId;
				
				$("html, body").stop().animate({scrollTop:($('#customid'+fid).parent('div.cont_postmsg').offset().top-100)}, '500', 'swing', function() {});
				
				$('#customid'+fid).parent('div.cont_postmsg').css({'background':'#d6f5ff'});
				$scope.getChilds(fid);
				$('.showReplyBoxforReply'+fid).show();
				setTimeout(function(){
					$('#customid'+fid).parent('div.cont_postmsg').removeAttr('style');
				},2000)
		  	},1000)
		}   
	}
	else {
		$scope.loadActiveThreads();
		if($routeParams.forumId){
		  	setTimeout(function(){
		  		var fid=$routeParams.forumId;
				
				$("html, body").stop().animate({scrollTop:($('#customid'+fid).parent('div.cont_postmsg').offset().top-100)}, '500', 'swing', function() {});
				
				$('#customid'+fid).parent('div.cont_postmsg').css({'background':'#d6f5ff'});
				$scope.getChilds(fid);
				$('.showReplyBoxforReply'+fid).show();
				setTimeout(function(){
					$('#customid'+fid).parent('div.cont_postmsg').removeAttr('style');
				},2000)
		  	},1000)
		}
	}
 	var preID = 0;
	$scope.repCount = {};
	$scope.getChilds=function(id){
		
		if(id==preID){
			if($scope.showChilds){
				$scope.showChilds = false;
				$scope.childThreads = [];
			}
			else
				$scope.showChilds = true;
		}
		else{
			preID=id;
			$scope.childThreads = [];
			$scope.showChilds = true;
			$('.replyBoxParent').hide();
		}
			
		
			
		if($scope.showChilds){
			$rootScope.currentId = id;
			if($scope.childThreads.length > 0) {
				$scope.childThreads = [];
			}
			else {
				$scope.parentId=null;
				$scope.threadId=null;
			}
			endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,$rootScope.currentId,null,null,function(child){
				if(child.result.success){
				   if(child.result.result[1].Replies) {
					for(var j=0; j<child.result.result[1].Replies.length; j++){    
					 if(id == child.result.result[1].Replies[j].ThreadId)
					  $scope.childThreads.push(child.result.result[1].Replies[j]);
					}
					$scope.repCount = {};
					for(var y=0;y<$scope.childThreads.length;y++){
						$scope.nextLevelChild=[];
						for(var x=0;x<$scope.childThreads.length;x++){
							if($scope.childThreads[x].ParentId==$scope.childThreads[y].Id){
								$scope.nextLevelChild.push($scope.childThreads[x]);
							}
						}
						$scope.repCount[$scope.childThreads[y].Id] = $scope.nextLevelChild.length;
						$scope.nextLevelChild=[];
					}

				   }
				   $scope.$apply();
				}
			});
		}	  
	};
	
	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	}
	
	$scope.showReplyBox = function(Id){
	
		$('.showReplyBoxforReply' + Id).toggle();
		
	};
 
	$scope.showCommentbox = function(id) {
		if($scope.childThreads.length>0){
			for(var i=0; i<$scope.childThreads.length; i++){
				if(id==$scope.childThreads[0].ThreadId){
					return true;
				}
				else {
					return false;
				}
			}
		}
		else { 
			if(id==$rootScope.currentId){ 
				return true;
			}
		}
	};
	
	$scope.submitPost = function(){
		debugger;
		if(uploadedMediaUrl){
			if(uploadMediaType == 'image' || uploadMediaType == 'Image'){
				if($scope.postBody)
					$scope.postBody = $scope.postBody + " <img src=\""+uploadedMediaUrl+"\">";
				else
					$scope.postBody = " <img src=\""+uploadedMediaUrl+"\">";
			}
			else{
				if($scope.postBody)
					$scope.postBody = $scope.postBody + " [View:"+uploadedMediaUrl+":0:0]";
				else
					$scope.postBody = " [View:"+uploadedMediaUrl+":0:0]";
			}
			uploadedMediaUrl = '';
			uploadMediaType = '';
		}
		
		$scope.threadInfo=[{"name":"Subject","value":$scope.postTitle},{"name":"Body","value":$scope.postBody}];
		endpoints.mobileHandler.createThread($scope.apiKey,$scope.userId,3,$scope.threadInfo,function(response){
			if(response.result.success){
				$scope.activeThreads = [];
				endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(forums){
					if(forums.result.result.Threads) {
						$rootScope.forumsCount=forums.result.result.Threads.length;
						$rootScope.allForums=forums.result.result.Threads;
						for(var i=0; i<$rootScope.allForums.length; i++){   
							$scope.activeThreads.push($rootScope.allForums[i]);
						}
						$scope.postTitle="";
						$scope.postBody="";
						$scope.$apply();
					}
				});
			}
		});  
	};

	
	$scope.expandForumPage =function(id){ 
		$location.path('/forum-expanded/'+id);
	};

	$scope.gotoReplyBox = function(){
		$('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
	};

	$scope.saveThreadReply=function(replyText,id){
		if(replyText){
			endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,id,0,replyText,function(response){ 
				if(response.result.success){
					$rootScope.currentId = id;
					if($scope.childThreads.length > 0) {
						$scope.childThreads = [];
					}    
					endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,id,null,null,function(child){
						if(child.result.result[1].Replies) {
							for(var j=0; j<child.result.result[1].Replies.length; j++){    
								if(id == child.result.result[1].Replies[j].ThreadId)
									$scope.childThreads.push(child.result.result[1].Replies[j]);
							}
						}
						$scope.$apply();
						$('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
					});
					$scope.activeThreads = [];
					$scope.loadActiveThreads();
					$('#reply').val('');
					$scope.$apply();
				}
			});
		}
		else{
			alert('blank data');
		}
	};
 
	$scope.savechildThreadReply = function(threadId,parentId){
		if($('#displayReplyBox'+parentId+' textarea').val()){
			var replyText = $('#displayReplyBox'+parentId+' textarea').val();
			endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,threadId,parentId,replyText,function(response){
				if(response.result.success){
					$rootScope.currentId = threadId;
					if($scope.childThreads.length > 0) {
					  $scope.childThreads = [];
					}
					endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,threadId,null,null,function(child){
						if(child.result.result[1].Replies){
							for(var j=0; j<child.result.result[1].Replies.length; j++){    
								if(threadId == child.result.result[1].Replies[j].ThreadId)
									$scope.childThreads.push(child.result.result[1].Replies[j]);
							}
						}      
						$scope.$apply();  
					});
					$scope.activeThreads = [];
					$scope.loadActiveThreads();
					$('#displayReplyBox'+parentId+' textarea').val('');
					$scope.nextLevelChild =[];
					$scope.$apply();
				}
				else{
					alert('Fail');
				}
			});
		}
		else{
		   alert('blank data');
		}
	};
 
	$scope.showChildCommentBox = function(id) {
		$('.childCommentBox').hide();	
		$('#displayReplyBox' + id).show();
		$scope.nextLevelChild=[];
		for(var i=0;i<$scope.childThreads.length;i++){
			if($scope.childThreads[i].ParentId==id){
				$scope.nextLevelChild.push($scope.childThreads[i]);
			}
		}
	};
 // $scope.mediaUpload= function(){
  // var hash = CryptoJS.HmacSHA1("Message", "akash");
  // alert(hash);
 // }
 	
 	$scope.closeThisLevel = function(id){
 		$('#displayReplyBox'+id).hide();
 		$scope.nextLevelChild = [];
 		$scope.$apply();
 	}

	$scope.uploadFile = function (input){
		$scope.data = {};
		$scope.data.userUpload = '';
		$scope.fileName="";
		var x="",
		Apikey = "6OoRO1+3C0askOF2V0gTEE4IUIyN2aNBuJLFoxCgBho=",
		secret = "Kl9wjZIdiEiQv4Y26Buvjc+ncQhVY25Nj83J5QZ8Pjg=",
		bucketName = "cfsagency",
		mediaType="",
		sourceAppType = "MRTelligent";
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			//reader.readAsDataURL(input);
			reader.onload = function (e) {	 
				//Sets the Old Image to new New Image
				//$('#photo-id').attr('src', e.target.result);	 
				//Create a canvas and draw image on Client Side to get the byte[] equivalent
				var mediaT = input.files[0].type.split('/');
				mediaType = mediaT[0];
				x=e.target.result.split('base64,');
				$scope.data.userUpload = x[1];
				console.log($scope.data.userUpload.substring(0,64).length);
				$scope.fileName = input.files[0].name;
				$('#upload-content').show();
				var media_hash = CryptoJS.HmacSHA1(Apikey + bucketName + projectId + sourceAppType + $scope.data.userUpload.substring(0,64) + mediaType, secret);

				var media_words = CryptoJS.enc.Base64.parse(media_hash.toString(CryptoJS.enc.Base64));

				var media_base64 = CryptoJS.enc.Base64.stringify(media_words);
				debugger;
				endpoints.mediaHandler.convertMedia(Apikey, media_base64, bucketName, projectId, sourceAppType, mediaType, $scope.data.userUpload, 0, function(result){
					if(result.result.success){
						if(mediaType == 'image' || mediaType == 'Image'){
							if($scope.replyText)
								replyText = $scope.replyText + "<img src=\""+result.result.result.URL+"\">";
							else
								replyText = "<img src=\""+result.result.result.URL+"\">";
						}
						else{
							if($scope.replyText)
								replyText = $scope.replyText + "[View:"+result.result.result.URL+":0:0]";
							else
								replyText = "[View:"+result.result.result.URL+":0:0]";
						}
						endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,$scope.ThreadId,$scope.ParentId,replyText,function(response){
							
							$route.reload();
						});
					}
					else{
						alert('fail');
					}

				});
				$scope.$apply();
			}					
			//Renders Image on Page
			reader.readAsDataURL(input.files[0]);
		}
	};
	
	$scope.uploadMedia = function (input){
		$scope.vdata = {};
		$scope.vdata.userUpload = '';
		$scope.fileName="";
		var x="",
		Apikey = "6OoRO1+3C0askOF2V0gTEE4IUIyN2aNBuJLFoxCgBho=",
		secret = "Kl9wjZIdiEiQv4Y26Buvjc+ncQhVY25Nj83J5QZ8Pjg=",
		bucketName = "cfsagency",
		mediaType="",
		sourceAppType = "MRTelligent";
		projectId = "communityforum";
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			//reader.readAsDataURL(input);
			reader.onload = function (e){	 
				//Sets the Old Image to new New Image
				//$('#photo-id').attr('src', e.target.result);	 
				//Create a canvas and draw image on Client Side to get the byte[] equivalent
				var mediaT = input.files[0].type.split('/');
				mediaType = mediaT[0];
				uploadMediaType = mediaT[0];
				x=e.target.result.split('base64,');
				$scope.vdata.userUpload = x[1];
				console.log($scope.vdata.userUpload.substring(0,64).length);
				$scope.fileName = input.files[0].name;
				$('#upload-content').show();
				var media_hash = CryptoJS.HmacSHA1(Apikey + bucketName + projectId + sourceAppType + $scope.vdata.userUpload.substring(0,64) + mediaType, secret);

				var media_words = CryptoJS.enc.Base64.parse(media_hash.toString(CryptoJS.enc.Base64));

				var media_base64 = CryptoJS.enc.Base64.stringify(media_words);
				debugger;
				endpoints.mediaHandler.convertMedia(Apikey, media_base64, bucketName, projectId, sourceAppType, mediaType, $scope.vdata.userUpload, 0, function(result){
					debugger;
					if(result.result.success){
						//alert('Media Uploaded');
						uploadedMediaUrl = result.result.result.URL;
					}
					else{
						alert('fail');
					}
				});
				$scope.$apply();
			}					
			//Renders Image on Page
			reader.readAsDataURL(input.files[0]);
		}
	};
	var projectId="";
	$scope.setProjectId = function(id, text){
		$scope.replyText = text;
		projectId = id;
		$scope.ThreadId = id;
		$scope.ParentId = 0;
	};
	
	$scope.replyProjectId = function(threadId, ParentId, text){
		$scope.replyText = text;
		projectId = threadId;
		$scope.ThreadId = threadId;
		$scope.ParentId = ParentId;
	};
		
	$scope.localDate = function(date){
		var localTime  = moment.utc(date).toDate();
		localTime = moment(localTime).subtract(3,'m').format('MMMM Do YYYY, h:mm a');
		return localTime;
	};
	
	$scope.clickInput = function(){
		$('.uploadMedia input').click();
	}
	
});

myApp.controller('forumExpandedCtrl', function($scope,$localStorage,$rootScope,$routeParams, $location, $route, $sce){
	$rootScope.settings = false;
	$rootScope.rewards = false;
	$rootScope.badges = false;
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = true;
	$scope.messagesactive = false;
	$scope.childThreads = [];
	$scope.showreplyBoxes = false;
	$scope.showAllReplies = true;
	$scope.parentId =null;
	$scope.threadId =null;
	if(!$localStorage.loginDetails){
	  delete $localStorage.loggedIn;
	  $location.path('/');
	}
	 var loginDetails = $localStorage.loginDetails;
	 $scope.apiKey = loginDetails[0].value;
	 $scope.userId = loginDetails[1].value;
	 var endpoints = {};
	 endpoints.apiKey = $scope.apiKey;
	 endpoints.mobileHandler = new MobileHandler();
	 endpoints.mediaHandler = new MediaHandler();
	endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(forums){
		if(forums.result.result.Threads){   
		 for(var i=0; i<forums.result.result.Threads.length; i++){
		  if($routeParams.forumId==forums.result.result.Threads[i].Id){
		   $scope.items=forums.result.result.Threads[i];
		  }
		 }
		}
		$scope.$apply();
	});
	endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,$routeParams.forumId,null,null,function(child){
		if(child.result.result[1].Replies){
			for(var j=0; j<child.result.result[1].Replies.length; j++){    
			 if($routeParams.forumId == child.result.result[1].Replies[j].ThreadId)
			  $scope.childThreads.push(child.result.result[1].Replies[j]);
			}
		}
		$scope.$apply();
		$(window).scrollTop(0);
	});

	$scope.gotoReplyBox = function(){
		if($scope.showreplyBoxes){
			$scope.showreplyBoxes = false;
		}
		else{
			$scope.showreplyBoxes = true;
		}
	};
 
	$scope.showReplies = function() {
		if($scope.showAllReplies){
			$scope.showAllReplies = false;
		}
		else{
			$scope.showAllReplies = true;
		}
	}
	
	$scope.saveThreadReply=function(replyText,id){
		if(replyText){
			endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,id,$scope.parentId,replyText,function(response){    
				if(response.result.success){			 
					$rootScope.currentId = id;
					if($scope.childThreads.length > 0) {
						$scope.childThreads = [];
					} 
					else{
						$scope.parentId=null;
						$scope.threadId=null;
					}
					endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,id,null,null,function(child){
						if(child.result.result[1].Replies){
							for(var j=0; j<child.result.result[1].Replies.length; j++){    
								if(id == child.result.result[1].Replies[j].ThreadId)
									$scope.childThreads.push(child.result.result[1].Replies[j]);
							}
							$scope.parentId = $scope.childThreads[0].ParentId;
							$scope.threadId = $scope.childThreads[0].ThreadId;
						}      
						$scope.$apply();
						$('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
					});
					$('#reply').val('');
				}
				else{
					alert('Fail');
				}
			});
		}
		else{
			alert('blank data');
		}
	};
 
	$scope.localDate = function(date){
		var localTime  = moment.utc(date).toDate();
		localTime = moment(localTime).subtract(3,'m').format('MMMM Do YYYY, h:mm a');
		return localTime;
	}
	
	$scope.showChildCommentBox = function(id) {
		$('.childCommentBox').hide();	
		$('#displayReplyBox' + id).show();
		$scope.nextLevelChild=[];
		for(var i=0;i<$scope.childThreads.length;i++){
			if($scope.childThreads[i].ParentId==id){
				$scope.nextLevelChild.push($scope.childThreads[i]);
			}
		}
	};
	
	$scope.showReplyBox = function(Id){
		if($scope.replyBoxforReplies){
			$scope.replyBoxforReplies = false;
			$('.showReplyBoxforReply' + Id).hide();
		}
		else{
			$scope.replyBoxforReplies = true;
			$('.showReplyBoxforReply' + Id).show();
		}
	};
 
	$scope.showCommentbox = function(id) {
		if($scope.childThreads.length>0){
			for(var i=0; i<$scope.childThreads.length; i++){
				if(id==$scope.childThreads[0].ThreadId){
					return true;
				}
				else {
					return false;
				}
			}
		}
		else { 
			if(id==$rootScope.currentId){ 
				return true;
			}
		}
	};
	
	$scope.savechildThreadReply = function(threadId,parentId) {
		if($('#displayReplyBox'+parentId+' textarea').val()){
			var replyText = $('#displayReplyBox'+parentId+' textarea').val();
			endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,threadId,parentId,replyText,function(response){
			
				if(response.result.success){     
					$rootScope.currentId = threadId;
					if($scope.childThreads.length > 0) {
						$scope.childThreads = [];
					}
				 
					endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,threadId,null,null,function(child){
						if(child.result.result[1].Replies){
						   for(var j=0; j<child.result.result[1].Replies.length; j++){    
							if(threadId == child.result.result[1].Replies[j].ThreadId)
							 $scope.childThreads.push(child.result.result[1].Replies[j]);
						   }     
						}		  
						$scope.$apply();	  
					});
					
					$scope.activeThreads = [];
					$('#displayReplyBox'+parentId+' textarea').val('');
					$scope.nextLevelChild =[];
					$scope.$apply();
				}
				else{
					alert('Fail');
				}
			});
		}
		else{
			alert('blank data');
		}
	};
	
	$scope.uploadFile = function (input){
		$scope.data = {};
		$scope.data.userUpload = '';
		$scope.fileName="";
		var x="",
		Apikey = "6OoRO1+3C0askOF2V0gTEE4IUIyN2aNBuJLFoxCgBho=",
		secret = "Kl9wjZIdiEiQv4Y26Buvjc+ncQhVY25Nj83J5QZ8Pjg=",
		bucketName = "cfsagency",
		mediaType="",
		sourceAppType = "MRTelligent";
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			//reader.readAsDataURL(input);
			reader.onload = function (e) {	 
				//Sets the Old Image to new New Image
				//$('#photo-id').attr('src', e.target.result);	 
				//Create a canvas and draw image on Client Side to get the byte[] equivalent
				var mediaT = input.files[0].type.split('/');
				mediaType = mediaT[0];
				x=e.target.result.split('base64,');
				$scope.data.userUpload = x[1];
				console.log($scope.data.userUpload.substring(0,64).length);
				$scope.fileName = input.files[0].name;
				$('#upload-content').show();
				var media_hash = CryptoJS.HmacSHA1(Apikey + bucketName + projectId + sourceAppType + $scope.data.userUpload.substring(0,64) + mediaType, secret);

				var media_words = CryptoJS.enc.Base64.parse(media_hash.toString(CryptoJS.enc.Base64));

				var media_base64 = CryptoJS.enc.Base64.stringify(media_words);

				endpoints.mediaHandler.convertMedia(Apikey, media_base64, bucketName, projectId, sourceAppType, mediaType, $scope.data.userUpload, 0, function(result){
					if(result.result.success){
						if(mediaType == 'image' || mediaType == 'Image'){
							if($scope.replyText)
								replyText = $scope.replyText + "<img src=\""+result.result.result.URL+"\">";
							else
								replyText = "<img src=\""+result.result.result.URL+"\">";
						}
						else{
							if($scope.replyText)
								replyText = $scope.replyText + "[View:"+result.result.result.URL+":0:0]";
							else
								replyText = "[View:"+result.result.result.URL+":0:0]";
						}
						endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,$scope.ThreadId,$scope.ParentId,replyText,function(response){
							$route.reload();
						});
					}
					else{
						alert('fail');
					}
				});
				$scope.$apply();
			}					
			//Renders Image on Page
			reader.readAsDataURL(input.files[0]);

			

		}
	};
	
	var projectId="";
	$scope.setProjectId = function(id, text){
		$scope.replyText = text;
		projectId = id;
		$scope.ThreadId = id;
		$scope.ParentId = 0;
	};
	
	$scope.replyProjectId = function(threadId, ParentId, text){
		$scope.replyText = text;
		projectId = threadId;
		$scope.ThreadId = threadId;
		$scope.ParentId = ParentId;
	};
	
	$scope.gotoReplyBox = function(){
		$('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
	};
	
	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	};
});

myApp.controller('messagesCtrl', function($scope, $cookieStore, $rootScope, $localStorage, $location, $route){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	$rootScope.settings = false;
	$rootScope.rewards = false;
	$rootScope.badges = false;
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = true;
	
	$rootScope.forumActive = false;
	$rootScope.messagesactive = true;
	$rootScope.feedActive = false;
	$rootScope.assignmentActive = false;
	
	$scope.showExpandMessage = false;
	var conversationId = '';
	$scope.messages = [];
	$rootScope.messages = [];
	$scope.tempArr = [];
	$scope.displayConversations = true;
	/* Getting all local Storage data for User Authentication */
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	//Querying APi for response using endpoints
	debugger;
	endpoints.mobileHandler.getInbox($scope.apiKey, $scope.userId, null, null, function(result){
		if(result.result.result.Conversations){
			for(var i=0; i<result.result.result.Conversations.length; i++){
				$scope.messages.push(result.result.result.Conversations[i]);
				$rootScope.messages.push(result.result.result.Conversations[i]);
			}
		}
		$scope.$apply();
	});
	
	$scope.showMessage = function(message) {
		$rootScope.message = message;
		$location.path('/messages/'+message.LastMessage.ConversationId);
	}
	
	$scope.expandMessage = function(message){
		if($scope.showExpandMessage){
			$scope.showExpandMessage = false;
			$scope.internalMessages = [];
		}
		else {
			$scope.showExpandMessage = true;
			$scope.internalMessages = [];
			$scope.message = message;
			conversationId = message.LastMessage.ConversationId;
			endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, conversationId, null, null, function(result){
				for(var i=0; i<result.result.result.Messages.length; i++){
					$scope.internalMessages.push(result.result.result.Messages[i]);
				}			
				$scope.$apply();
			});
		}
	};
	
	$scope.createNewMessage = function() {
		$scope.userNames = [];
		$scope.projectId = '';
		if($rootScope.messages.length > 0){
			for(var i=0; i<$rootScope.messages[0].Participants.length; i++){
				$scope.userNames.push($rootScope.messages[0].Participants[i].Username);
			}
		}
		else{
			$scope.userNames.push($localStorage.userName);
		}
		if($scope.userNames.length > 0){
			endpoints.mobileHandler.sendMessageToModerators($scope.apiKey, $scope.userId, $scope.subject, $scope.messageBody, function(result){
				if(result.result.success){
					alert('Message successfully sent to moderators');
					$scope.subject = '';
					$scope.messageBody = '';
					$route.reload();
				}
			});
		}
	};
	
	$scope.submitMessageReply = function(items) {
		if(items.messageReplyText){
			endpoints.mobileHandler.sendMessageReply($scope.apiKey, $scope.userId, conversationId, items.messageReplyText, function(result){
				if(result.result.success){
					items.messageReplyText = '';
					$scope.internalMessages = [];
					endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, conversationId, null, null, function(result){
						for(var i=0; i<result.result.result.Messages.length; i++){
								$scope.internalMessages.push(result.result.result.Messages[i]);
						}						
						$scope.$apply();
					});	
				}
			});
		}
	}
});

myApp.controller('messageconversationCtrl', function($scope,$localStorage,$cookieStore,$routeParams,$rootScope){
	
	$rootScope.settings = false;
	$rootScope.rewards = false;
	$rootScope.badges = false;
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = true;
	$scope.messages = [];
	/* Getting all local Storage data for User Authentication */
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.messages = [];
	var endpoints = {};
	$scope.newArray = [];
	endpoints.apiKey = "835mzggn289l9wxnjxjr323kny6q";
	endpoints.mobileHandler = new MobileHandler();

	if($rootScope.messages){
		for(var i=0;i<$rootScope.messages.length;i++){
			if($routeParams.conversationId==$rootScope.messages[i].Id){
				$scope.messages.push($rootScope.messages[i]);
			}
		}
	}
	else{
		endpoints.mobileHandler.getInbox($scope.apiKey, $scope.userId, null, null, function(result){
			if(result.result.result.Conversations){
				for(var i=0; i<result.result.result.Conversations.length; i++){
					$scope.messages.push(result.result.result.Conversations[i]);
					$rootScope.messages.push(result.result.result.Conversations[i]);
				}
			}
			$scope.$apply();
		});
	}
	
	
	
	$scope.internalMessages = [];
	$scope.firstMessage = [];
	endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, $routeParams.conversationId, null, null, function(result){
		
		for(var i=0; i<result.result.result.Messages.length; i++){
			if(i<result.result.result.Messages.length-1){
				$scope.internalMessages.push(result.result.result.Messages[i]);
			}
			else{
				
				$scope.firstMessage.push(result.result.result.Messages[i]);
			}
				
		}		
		$scope.$apply();
	});	

	$scope.localDate = function(date){
		var localTime  = moment.utc(date).toDate();
		localTime = moment(localTime).subtract(3,'m').format('MMMM Do YYYY, h:mm a');
		return localTime;
	}
	
	$scope.submitMessageReply = function() {
		if($scope.messageReplyText){
			endpoints.mobileHandler.sendMessageReply($scope.apiKey, $scope.userId, $routeParams.conversationId, $scope.messageReplyText, function(result){
				if(result.result.success){
					$scope.messageReplyText = '';
					$scope.internalMessages = [];
					$scope.messages = [];
					$rootScope.messages=[];
					$scope.firstMessage = [];
					endpoints.mobileHandler.getInbox($scope.apiKey, $scope.userId, null, null, function(result){
						if(result.result.result.Conversations){
							for(var i=0; i<result.result.result.Conversations.length; i++){
								$scope.messages.push(result.result.result.Conversations[i]);
								$rootScope.messages.push(result.result.result.Conversations[i]);
							}
						}
						$scope.$apply();
					});
					endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, $routeParams.conversationId, null, null, function(result){
						for(var i=0; i<result.result.result.Messages.length; i++){
								if(i<result.result.result.Messages.length-1){
									$scope.internalMessages.push(result.result.result.Messages[i]);
								}
								else{
									
									$scope.firstMessage.push(result.result.result.Messages[i]);
								}
						}						
						$scope.$apply();
					});	

				}
				else{
					alert('Error');
				}
			});
		}
	};
	
	$scope.createNewMessage = function() {
		$scope.userNames = [];
		$scope.projectId = '';
		if($rootScope.messages.length > 0){
			for(var i=0; i<$rootScope.messages[0].Participants.length; i++){
				$scope.userNames.push($rootScope.messages[0].Participants[i].Username);
			}
		}
		else{
			$scope.userNames.push($localStorage.userName);
		}
		if($scope.userNames.length > 0){
			endpoints.mobileHandler.sendMessageToModerators($scope.apiKey, $scope.userId, $scope.subject, $scope.messageBody, function(result){
				if(result.result.success){
					alert('Message successfully sent to moderators');
					$scope.subject = '';
					$scope.messageBody = '';
					$route.reload();
				}
			});
		}
	};

	$scope.removeReceiver = function(id){
		$('#'+id).removeClass('receiver');
	}
});


myApp.controller('profileCtrl', function($scope, $localStorage,$cookieStore, $location, $rootScope, $route){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	$scope.uname = '@'+ $localStorage.userName;
	
	$('body').addClass('dashboard_pages');
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	$('.tab-section').hide();
	$('#profile_setting').show();
	$scope.messages = [];
	$scope.tempArr = [];
	$scope.resetPassword = {};
	$scope.formData = {};
	
	/* Getting all local Storage data for User Authentication */
	var loginDetails = $localStorage.loginDetails;
	
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.yearSelected = true;
	var selectedYearValue = document.getElementById("birthyear");
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	//Querying APi for response using endpoints
	$scope.profilePage = 'setting-page-active';
	
	$scope.redirectTo = function(link){
		if(link == 'profile'){
			$rootScope.settings = true;
			$rootScope.rewards = false;
			$rootScope.badges = false;
			$location.path('/profile');
		}
		if(link == 'badges'){
			$rootScope.settings = false;
			$rootScope.rewards = false;
			$rootScope.badges = true;
			$location.path('/badges');
		}
		if(link == 'rewards'){
			$rootScope.settings = false;
			$rootScope.rewards = true;
			$rootScope.badges = false;
			$location.path('/rewards');
		}
	};
	
	$scope.openFile = function(){
		$('#photo-upload').click();
	}
	
	endpoints.mobileHandler.getPanelistAttributes($scope.apiKey, $scope.userId, $scope.panelistId, function(callback){
		if(callback.result.success){
			$scope.formData.avatarUrl = callback.result.result.AvatarUrl;
			$scope.formData.fname = callback.result.result.fname;
			$scope.formData.lname = callback.result.result.lname;
			$scope.formData.email = callback.result.result.email;
			if(callback.result.result.bdate.slice('/')[1] == '/')
				$scope.formData.selectedMonth = callback.result.result.bdate.slice('/')[0];
			else
				$scope.formData.selectedMonth = callback.result.result.bdate.slice('/')[0] + callback.result.result.bdate.slice('/')[1];
			if(callback.result.result.bdate.slice('/')[1] != '/')
				$scope.formData.selectedDate = callback.result.result.bdate.slice('/')[3] + callback.result.result.bdate.slice('/')[4];
			else
				if(callback.result.result.bdate.slice('/')[3] == '/')
					$scope.formData.selectedDate = callback.result.result.bdate.slice('/')[2];
				else
					$scope.formData.selectedDate = callback.result.result.bdate.slice('/')[2] + callback.result.result.bdate.slice('/')[3];
			if(callback.result.result.bdate.slice('/')[3] == '/')
				$scope.formData.selectedYear = callback.result.result.bdate.slice('/')[4]+callback.result.result.bdate.slice('/')[5]+callback.result.result.bdate.slice('/')[6]+callback.result.result.bdate.slice('/')[7];				
			if(callback.result.result.bdate.slice('/')[4] == '/')
				$scope.formData.selectedYear = callback.result.result.bdate.slice('/')[5]+callback.result.result.bdate.slice('/')[6]+callback.result.result.bdate.slice('/')[7]+callback.result.result.bdate.slice('/')[8];
			if(callback.result.result.bdate.slice('/')[5] == '/')
				$scope.formData.selectedYear = callback.result.result.bdate.slice('/')[6]+callback.result.result.bdate.slice('/')[7]+callback.result.result.bdate.slice('/')[8]+callback.result.result.bdate.slice('/')[9];
			if($scope.formData.selectedYear){
				if(selectedYearValue){
					for(var i=0; i<selectedYearValue.length; i++){
						if($scope.formData.selectedYear == selectedYearValue.options[i].text){
							$scope.yearSelected = false;
							$scope.formData.selectedYear = $scope.selectedYear;
						}
					}
					if($scope.yearSelected)
						$scope.formData.selectedYear = selectedYearValue.options[selectedYearValue.length -1].text;
				}
			}
			
			$scope.formData.gender = callback.result.result.gend;
			$scope.formData.zipcode = callback.result.result.zipc;
			if(callback.result.result.cellphone){
				$scope.formData.mobileNumber = callback.result.result.cellphone.replace(/-/g, "");
			}
			
			endpoints.mobileHandler.getIncentives($scope.apiKey, $scope.userId, $scope.panelistId, null, null, function(result){
				$scope.redeemable = (result.result.result[result.result.result.length-1].redeemable/100).toFixed(2);
				$scope.$apply();
			});			
		}
	});
	
	endpoints.mobileHandler.getPanelistBadges($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		$scope.allBadges = [];
		for(var i=0; i< result.result.result.length; i++){
			$scope.allBadges.push(result.result.result[i]);
		}
		$scope.$apply();
	});
	
	$scope.updateProfile = function() {
		// if(!$scope.selectedYear || !$scope.selectedMonth || !$scope.selectedDate){
			// alert('Please select date of birth');
			// return false;
		// }
		// if(!$scope.gender){
			// alert('Gender can not be blank');
			// return false;
		// }
		$scope.bdate = $scope.formData.selectedMonth + '/' + $scope.formData.selectedDate + '/' + $scope.formData.selectedYear;
		$scope.attributes = [{"name": "fname", "value": $scope.formData.fname}, {"name": "lname", "value": $scope.formData.lname}, {"name": "email", "value": $scope.formData.email}, {"name": "bdate", "value": $scope.bdate}, {"name": "gend", "value": $scope.formData.gender}, {"name": "zipc", "value": $scope.formData.zipcode}, {"name": "cellphone", "value": $scope.formData.mobileNumber}];
		$scope.skipAddressVerify = false;

		endpoints.mobileHandler.updatePanelistAttributes($scope.apiKey, $scope.userId, $scope.panelistId, $scope.attributes, $scope.skipAddressVerify, function(response){
			if(response.result.success){
				alert('Profile successfully updated');
				$route.reload();
			}
		});
	};
	
	$scope.uploadFile = function (input){
		$scope.data = {};
		$scope.data.userUpload = '';
		$scope.fileName="";
		var x="";
		if(input.files && input.files[0]) {
			$scope.showLoader = true;
			var reader = new FileReader();
			//reader.readAsDataURL(input);
			reader.onload = function (e) {
				var mediaT = input.files[0].type.split('/');
				mediaType = mediaT[0];
				x=e.target.result.split('base64,');
				$scope.data.userUpload = x[1];
				//console.log($scope.data.userUpload.substring(0,64).length);
				$scope.fileName = input.files[0].name;
				
				endpoints.mobileHandler.updateAvatar($scope.apiKey, $scope.userId, $scope.data.userUpload, $scope.fileName, function(result){
					if(result.result.success){
						$scope.showLoader = false;
						$route.reload();
					}
					else{
						alert('fail');
					}
				});
				$scope.$apply();
			}					
			//Renders Image on Page
			reader.readAsDataURL(input.files[0]);
		}
	};
	
	$scope.resetPass = function(resetPassword) {

		$scope.currentPass = $scope.resetPassword.cpass;
		$scope.newPass = $scope.resetPassword.npass;
		$scope.verifyNewPass = $scope.resetPassword.vnpass;
		if($scope.resetPassword.vnpass == $scope.resetPassword.npass){
			endpoints.mobileHandler.changePassword($scope.apiKey, $scope.userId, $scope.currentPass, $scope.newPass, function(result){
				if(result.result.success){
					alert('Password Changed');
					$scope.resetPassword.cpass = '';
					$scope.resetPassword.npass = '';
					$scope.resetPassword.vnpass = '';
					delete $localStorage.loggedIn;
					delete $localStorage.loginDetails;
					$location.path('/');
					$scope.$apply();
				}
				else{
					alert(result.result.message);
				}
			});
		}
		else{
			alert('Password Do not match');
			$scope.resetPassword.npass = '';
			$scope.resetPassword.vnpass = '';
			return;
		}
	};
});

myApp.controller('badgesCtrl', function($scope, $localStorage, $location, $route){
	debugger;
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.showLoader = false;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	
	endpoints.mobileHandler.getPanelistAttributes($scope.apiKey, $scope.userId, $scope.panelistId, function(callback){
		if(callback.result.success){
			$scope.avatarUrl = callback.result.result.AvatarUrl;
			$scope.fname = callback.result.result.fname;
			$scope.lname = callback.result.result.lname;
			$scope.$apply();
			
		}
	});
	
	endpoints.mobileHandler.getPanelistBadges($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		$scope.allBadges = [];
		for(var i=0; i< result.result.result.length; i++){
			$scope.allBadges.push(result.result.result[i]);
		}
	
		$scope.$apply();
	});
	
	$scope.uploadFile = function (input){
		$scope.data = {};
		$scope.data.userUpload = '';
		$scope.fileName="";
		var x="";
		if(input.files && input.files[0]) {
			$scope.showLoader = true;
			var reader = new FileReader();
			//reader.readAsDataURL(input);
			reader.onload = function (e) {
				var mediaT = input.files[0].type.split('/');
				mediaType = mediaT[0];
				x=e.target.result.split('base64,');
				$scope.data.userUpload = x[1];
				//console.log($scope.data.userUpload.substring(0,64).length);
				$scope.fileName = input.files[0].name;
				
				endpoints.mobileHandler.updateAvatar($scope.apiKey, $scope.userId, $scope.data.userUpload, $scope.fileName, function(result){
					if(result.result.success){
						$scope.showLoader = false;
						$route.reload();
					}
					else{
						alert('fail');
					}
				});
				$scope.$apply();
			}					
			//Renders Image on Page
			reader.readAsDataURL(input.files[0]);
		}
	};
});

myApp.controller('notificationCtrl', function($scope, $localStorage, $location){

	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.notificationPage = 'setting-page-active';
	endpoints.mobileHandler.getNotifications($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		if(result.result.success){
			debugger;
			var resultArray = result.result.result;
			$scope.preferences = resultArray;
			for(var i=0; i<resultArray.length; i++){
				switch(resultArray[i]){
					case "2a": 
						if($scope.preferences.indexOf("2e") !== -1){
							if($scope.preferences.indexOf("2h") !== -1){
								$scope.smsCheck = true;
							}
						}
					break;
					case "3a": 
						if($scope.preferences.indexOf("3e") !== -1){
							if($scope.preferences.indexOf("3h") !== -1){
								$scope.emailCheck = true;
							}
						}
					break;
					case "2b": 
						if($scope.preferences.indexOf("2c") !== -1){
							$scope.forumSMS = true;
						}
					break;
					case "3b": 
						if($scope.preferences.indexOf("3c") !== -1){
							$scope.forumEmail = true;
						}
					break;
					case "2f": 
						$scope.messagesSMS = true;
					break;
					case "3f": 
						$scope.messagesEmail = true;
					break;
					case "2d":
						$scope.resultsSMS = true;
						break;
					case "3d":
						$scope.resultsEmail = true;
						break;
				}
			}
			$scope.$apply();
		}
	});
	
	$scope.updateNotification = function() {
		debugger;
		if($scope.emailCheck){
			if($scope.preferences.indexOf("3a") == -1)
				$scope.preferences.push("3a", "3e", "3h");
		}
		else{
			var findIndexes = [];
			if($scope.preferences.indexOf("3a") !== -1){
				findIndexes.push($scope.preferences.indexOf("3a"));
				findIndexes.push($scope.preferences.indexOf("3e"));
				findIndexes.push($scope.preferences.indexOf("3h"));
				if(findIndexes.length > 0){
					for(var i=0; i< findIndexes.length; i++){
						$scope.preferences.splice(findIndexes[i], 1);
					}
				}
			}
		}
		if($scope.smsCheck){
			if($scope.preferences.indexOf("2a") == -1)
				$scope.preferences.push("2a", "2e", "2h");
		}
		else{
			var findIndexes = [];
			if($scope.preferences.indexOf("2a") !== -1){
				findIndexes.push($scope.preferences.indexOf("2a"));
				findIndexes.push($scope.preferences.indexOf("2e"));
				findIndexes.push($scope.preferences.indexOf("2h"));
				if(findIndexes.length > 0){
					for(var i=0; i< findIndexes.length; i++){
						$scope.preferences.splice(findIndexes[i], 1);
					}
				}
			}
		}
		
		if($scope.forumEmail){
			if($scope.preferences.indexOf("3b") == -1)
				$scope.preferences.push("3b", "3c");
		}
		else {
			var findIndexes = [];
			if($scope.preferences.indexOf("3b") !== -1){
				findIndexes.push($scope.preferences.indexOf("3b"));
				findIndexes.push($scope.preferences.indexOf("3c"));
				if(findIndexes.length > 0){
					for(var i=0; i< findIndexes.length; i++){
						$scope.preferences.splice(findIndexes[i], 1);
					}
				}
			}
		}
		if($scope.forumSMS){
			if($scope.preferences.indexOf("2b") == -1)
				$scope.preferences.push("2b", "2c");
		}
		else{
			var findIndexes = [];
			if($scope.preferences.indexOf("2b") !== -1){
				findIndexes.push($scope.preferences.indexOf("2b"));
				findIndexes.push($scope.preferences.indexOf("2c"));
				if(findIndexes.length > 0){
					for(var i=0; i< findIndexes.length; i++){
						$scope.preferences.splice(findIndexes[i], 1);
					}
				}
			}
		}
		
		if($scope.resultsEmail){
			if($scope.preferences.indexOf("3d") == -1)
				$scope.preferences.push("3d");
		}
		else{
			var index = $scope.preferences.indexOf("3d");
			if(index !== -1)
				$scope.preferences.splice(index, 1);
		}
		if($scope.resultsSMS){
			if($scope.preferences.indexOf("2d") == -1)
				$scope.preferences.push("2d");
		}
		else{
			var index = $scope.preferences.indexOf("2d");
			if(index !== -1)
				$scope.preferences.splice(index, 1);
		}
		
		if($scope.messagesEmail){
			if($scope.preferences.indexOf("3f") == -1)
				$scope.preferences.push("3f");
		}
		else{
			var index = $scope.preferences.indexOf("3f");
			if(index !== -1)
				$scope.preferences.splice(index, 1);
		}
		if($scope.messagesSMS){
			if($scope.preferences.indexOf("2f") == -1)
				$scope.preferences.push("2f");
		}
		else{
			var index = $scope.preferences.indexOf("2f");
			if(index !== -1)
				$scope.preferences.splice(index, 1);
		}
		if($scope.messagesPush){
			if($scope.preferences.indexOf("1f") == -1)
				$scope.preferences.push("1f");
		}
		else{
			var index = $scope.preferences.indexOf("1f");
			if(index !== -1)
				$scope.preferences.splice(index, 1);
		}
		debugger;
		if($scope.messagesSMS || $scope.resultsSMS || $scope.forumSMS || $scope.smsCheck){
			endpoints.mobileHandler.getPanelistAttributes($scope.apiKey, $scope.userId, $scope.panelistId, function(callback){
				if(callback.result.success){
					if(callback.result.result.cellphone){
						$scope.mobileNumber = callback.result.result.cellphone.replace(/-/g, "");
						if($scope.mobileNumber.length == 10){
							$scope.preferences.push("2f");
							$scope.notificationUpdate = true;
						}
						else{
							alert('Phone Number not valid');
							$scope.forumSMS = '';
							$scope.messagesSMS = '';
							$scope.resultsSMS = '';
							$scope.smsCheck = '';
							var findIndexes = [];
							findIndexes.push($scope.preferences.indexOf("2a"));
							findIndexes.push($scope.preferences.indexOf("2e"));
							findIndexes.push($scope.preferences.indexOf("2h"));
							findIndexes.push($scope.preferences.indexOf("2b"));
							findIndexes.push($scope.preferences.indexOf("2c"));
							findIndexes.push($scope.preferences.indexOf("2d"));
							findIndexes.push($scope.preferences.indexOf("2f"));
							
							if(findIndexes.length > 0){
								for(var i=0; i< findIndexes.length; i++){
									$scope.preferences.splice(findIndexes[i], 1);
								}
							}
							$scope.notificationUpdate = true;
							$location.path('/profile');
						}
					}
					else{
						alert('Can not update notification, Please update your phone number');
						$scope.forumSMS = '';
						$scope.messagesSMS = '';
						$scope.resultsSMS = '';
						$scope.smsCheck = '';
						var findIndexes = [];
						findIndexes.push($scope.preferences.indexOf("2a"));
						findIndexes.push($scope.preferences.indexOf("2e"));
						findIndexes.push($scope.preferences.indexOf("2h"));
						findIndexes.push($scope.preferences.indexOf("2b"));
						findIndexes.push($scope.preferences.indexOf("2c"));
						findIndexes.push($scope.preferences.indexOf("2d"));
						findIndexes.push($scope.preferences.indexOf("2f"));
						
						if(findIndexes.length > 0){
							for(var i=0; i< findIndexes.length; i++){
								$scope.preferences.splice(findIndexes[i], 1);
							}
						}
						$scope.notificationUpdate = true;
						$location.path('/profile');
					}
						endpoints.mobileHandler.updateNotifications($scope.apiKey, $scope.userId, $scope.panelistId, $scope.preferences, function(result){
							alert('Notifications updated');
						});
				}
				$scope.$apply();
			});
		}
		else{
			endpoints.mobileHandler.updateNotifications($scope.apiKey, $scope.userId, $scope.panelistId, $scope.preferences, function(result){
				alert('Notifications updated');
			});
		}
	}
});

myApp.controller('resetpasswordCtrl', function($scope, $localStorage, $location){
	$scope.resetPassword = 'setting-page-active';
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	
	/* Getting all local Storage data for User Authentication */
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.resetPass = function() {
		$scope.currentPass = $scope.cpass;
		$scope.newPass = $scope.npass;
		$scope.verifyNewPass = $scope.vnpass;
		if($scope.vnpass == $scope.npass){
			endpoints.mobileHandler.changePassword($scope.apiKey, $scope.userId, $scope.currentPass, $scope.newPass, function(result){
				if(result.result.success){
					alert('Password Changed');
					$scope.cpass = '';
					$scope.npass = '';
					$scope.vnpass = '';
					delete $localStorage.loggedIn;
					delete $localStorage.loginDetails;
					$location.path('/');
					$scope.$apply();
				}
				else{
					alert(result.result.message);
				}
			});
		}
		else{
			alert('Password Do not match');
			$scope.npass = '';
			$scope.vnpass = '';
			return;
		}
	};	
});

myApp.controller('rewardsCtrl', function($scope, $location, $rootScope, $localStorage, $modal){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	
	/* Getting all local Storage data for User Authentication */
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.incentivesDataArray = [];
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	


	endpoints.mobileHandler.getIncentives($scope.apiKey, $scope.userId, $scope.panelistId, null, null, function(result){
		for(var i=0; i<result.result.result[0].length; i++){
			$scope.incentivesDataArray.push(result.result.result[0][i]);
		}
		$scope.incentivesData = result.result.result[result.result.result.length -1];
		$scope.redeemable = ($scope.incentivesData.redeemable/100).toFixed(2);
		$scope.earned = ($scope.incentivesData.earned/100).toFixed(2);
		$scope.$apply();
	});
	
	$scope.openModal = function(){
		$modal.open({
		  templateUrl: 'rewardsModal.html',
		  controller: 'rewardsModalCtrl',
		  resolve: {
			rewards: function(){
				return $scope.redeemable;
			}
		  }
		});
	};
	
	$scope.openDetails = function(){
		$modal.open({
		  templateUrl: 'rewardDetails.html',
		  controller: 'rewardDetailsCtrl'
		});
	};
	
	$scope.openDetailsModal = function(code, amount){
		$scope.claimCode = code;
		$scope.cardAmount = amount;
		$modal.open({
		  templateUrl: 'rewardDetails.html',
		  controller: 'rewardDetailsCtrl',
		  resolve: {
			claimCode: function(){
				return code;
			},
			cardAmount: function(){
				return amount;
			}
		  }
		});
	};

	$(window).load(function(){

		if($('.history .credits').height()>160){
			$('.history .credits').slimScroll({
		        height: '160px'
		    });
		}
		
	})
});

myApp.controller('rewardsModalCtrl', function($scope, $modalInstance, rewards, $rootScope){
	if($rootScope.email){
			$scope.email = $rootScope.email;
		}
		$scope.rewardPoints = rewards;
	$scope.ok = function () {
		$modalInstance.dismiss('cancel');
	}
});

myApp.controller('rewardDetailsCtrl', function($scope, $rootScope, $modalInstance, claimCode, cardAmount){
	$scope.claimCode = claimCode;
	$scope.cardAmount = cardAmount;
	$scope.ok = function () {
		$modalInstance.dismiss('cancel');
	}
})

.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
		if(attrs.dynamic){
			ele.html(attrs.dynamic);
			$compile(ele.contents())(scope);
		}
    }
  };
})

.directive('bxSlider', function () {
        var BX_SLIDER_OPTIONS = {
             auto: true,
			autoHover: true
        };

        return {
            restrict: 'A',
            require: 'bxSlider',
            priority: 0,
            controller: function() {},
            link: function (scope, element, attrs, ctrl) {
                var slider;
                ctrl.update = function() {
                    slider && slider.destroySlider();
                    slider = element.bxSlider(BX_SLIDER_OPTIONS);
                };
            }
        }
    })
 
.directive('bxSliderItem', function($timeout) {
        return {
            require: '^bxSlider',
            link: function(scope, elm, attr, bxSliderCtrl) {
                if (scope.$last) {
                    bxSliderCtrl.update();
                }
            }
        }
    })

.directive('initializeRadio', function(){
	return {
			restrict: 'A',
            link: function(scope, elm, attr) {
				elm.wrap("<span class='custom-radio'></span>");
				if(elm.is(':checked')){
					elm.parent().addClass("selected");
				}
				
				// function customRadio(radioName){
					// var radioButton = $('input[name="'+ radioName +'"]');
					// $(radioButton).each(function(){
						// $(this).wrap( "<span class='custom-radio'></span>" );
						// if($(this).is(':checked')){
							// $(this).parent().addClass("selected");
						// }
					// });
					// $(radioButton).click(function(){
						// if($(this).is(':checked')){
							// $(this).parent().addClass("selected");
						// }
						// $(radioButton).not(this).each(function(){
							// $(this).parent().removeClass("selected");
						// });
					// });
				// }
            }
        }
})

.directive('docListWrapper', ['$timeout', function ($timeout) {
        return {
            restrict: 'C',
            priority: 500,
            replace: false,
            templateUrl: 'tmpl-doc-list-wrapper',
            scope: { docs: '=docs'},
            link: function (scope, element, attrs) {
            }
        };
    }])

.directive('mainslider', function($timeout){
  return {
      link: function(scope, elm, attrs) {
            elm.bxSlider({mode: 'vertical'}, {slideMargin: 5});
			
			scope.initializePagepipling();
       }
	}
})

.directive('pagepiling', function($rootScope){
	return{
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.css({'opacity': 0});
			if(!$rootScope.initialized){
				if($('#pp-nav').length){
					$('#pp-nav').remove();
				}
				element.pagepiling({
					navigation: {
					  'textColor': '#000',
					  'bulletsColor': '#fff',
					  'position': 'left'
					},
					keyboardScrolling: false
				});
				setTimeout(function(){
					$rootScope.initialized = true;
					element.css({'opacity': 1});
				}, 100);
			}
		}
	}
}).directive('initializeSelectpicker', function($rootScope){
	return{
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel){
			element.selectpicker();
			
			scope.$watch(attrs.ngModel, function (newVal, oldVal) {
				scope.$evalAsync(function () {
				  if (!attrs.ngOptions || /track by/.test(attrs.ngOptions)) element.val(newVal);
				  element.selectpicker('refresh');
				  if(scope.dropChange)
					scope.dropChange(newVal);
				});
			});

			ngModel.$render = function () {
				scope.$evalAsync(function () {
				  element.selectpicker('refresh');
				});
			}			
		}
	}
});

myApp.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

(function (angular){
    'use strict';

    var module = angular.module('angular-bind-html-compile', []);

    module.directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    // Incase value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);
}(window.angular));

angular.module('angular-bootstrap-select', [])
  .directive('selectpicker', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      require: '?ngModel',
      priority: 10,
      compile: function (tElement, tAttrs, transclude) {
        tElement.selectpicker($parse(tAttrs.selectpicker)());
        tElement.selectpicker('refresh');
        return function (scope, element, attrs, ngModel) {
          if (!ngModel) return;

          scope.$watch(attrs.ngModel, function (newVal, oldVal) {
            scope.$evalAsync(function () {
              if (!attrs.ngOptions || /track by/.test(attrs.ngOptions)) element.val(newVal);
              element.selectpicker('refresh');
			  scope.dropChange(newVal);
            });
          });

          ngModel.$render = function () {
            scope.$evalAsync(function () {
              element.selectpicker('refresh');
            });
          }
        };
      }
        
    };
  }]);
  
angular.module('angular-bootstrap-select.extra', [])
  .directive('toggle', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
		
        // prevent directive from attaching itself to everything that defines a toggle attribute
        if (!element.hasClass('selectpicker')) {
          return;
        }
        
        var target = element.parent();
        var toggleFn = function () {
          target.toggleClass('open');
        };
        var hideFn = function () {
          target.removeClass('open');
        };

        element.on('click', toggleFn);
        element.next().on('click', hideFn);

        scope.$on('$destroy', function () {
          element.off('click', toggleFn);
          element.next().off('click', hideFn);
        });
      }
    };
  });

