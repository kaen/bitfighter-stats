var bfstats = angular.module('bfstats', ['ngGrid']);

var BADGE_MAP = {
  0: ["Developer", "developer.png"], 
  2: ["Twenty five flags", "twenty_five_flags.png"], 
  3: ["BBB Gold Medalist", "bbb_gold.png"], 
  4: ["BBB Silver Medalist", "bbb_silver.png"], 
  5: ["BBB Bronze Medalist", "bbb_bronze.png"], 
  6: ["BBB Participant", "bbb_participation.png"], 
  7: ["Level Design Contest Winner", "level_design_winner.png"], 
  8: ["Zone Controller", "zone_controller.png"],
  9: ["Raging Rabid Rabbit", "raging_rabid_rabbit.png"],
  10: ["Hat Trick", "hat_trick.png"],
  11: ["Last-Second Win", "last_second_win.png"]
};
 
bfstats.controller('StatsCtrl', function ($scope, $http) {

	function getAllStats() {
		var i;
		var row;
		var params = {
			month: $scope.selectedPeriod.month + 1,
			year: $scope.selectedPeriod.year
		};

		if($scope.statsLoading) {
			return;
		}

		$scope.statsLoading = true;

		$http.get('stats.php', { params: params})
		.success(function(data) {
			$scope.total = data.count;
			$scope.stats = data;

			for(i in data) {
				row = data[i];
				row.last_played = moment(row.last_played + " GMT+0100").fromNow();
			}
		})
		.error(function(data, status, headers, config) {
			console.log(status);
		})
		['finally'](function() {
			$scope.statsLoading = false;
		});
	}

	function getPlayerStats() {
		var params = {
			month: $scope.selectedPeriod.month + 1,
			year: $scope.selectedPeriod.year,
			player: $scope.selectedPlayer.player_name,
			authed: $scope.selectedPlayer.is_authenticated === '1' ? 'yes' : 'no'
		};

		if($scope.playerStatsLoading) {
			return;
		}

		$scope.playerStatsLoading = true;

		$http.get('player.php', {params: params})
		.success(function(data) {
			var i;
			var achievement;

			console.log(data);

			// convert integer strings to actual integers
			for(i in data) {
				if(parseInt(data[i], 10).toString() === data[i]) {
					data[i] = parseInt(data[i], 10);
				}
			}

			data.game_count = data.win_count + data.lose_count + data.tie_count + data.dnf_count;
			data.finished_game_count = data.win_count + data.lose_count + data.tie_count;

			for(i in data.achievements) {
				achievement = data.achievements[i];
				achievement.hint = BADGE_MAP[achievement.achievement_id][0];
				achievement.image = BADGE_MAP[achievement.achievement_id][1];
			}
			$scope.player = data;
		})
		.error(function(data, status, headers, config) {
			console.log(status);
		})
		['finally'](function() {
			$scope.playerStatsLoading = false;
		});
	}

	$scope.loadingStyle = 'loading';

	$scope.options = {
		enableColumnResize: true,
		showColumnMenu: true,
		showFilter: true,
		// showFooter: true,
		showHeader: true,
		afterSelectionChange: function(row, event) {
			$scope.selectedPlayer = row.entity;
		},
		multiSelect: false,
		columnDefs: [
			{field: 'player_name',         visible: true, displayName: 'Player Name', width: '100'},
			{field: 'kill_death_ratio',    visible: true, displayName: 'KDR'                      },
			{field: 'kill_count',          visible: true, displayName: 'Kills'                    },
			{field: 'death_count',         visible: true, displayName: 'Deaths'                   },
			{field: 'suicide_count',       visible: false, displayName: 'Suicides'                 },
			{field: 'game_count',          visible: true, displayName: 'Games'                    },
			{field: 'win_count',           visible: true, displayName: 'Wins'                     },
			{field: 'lose_count',          visible: true, displayName: 'Losses'                   },
			{field: 'tie_count',           visible: false, displayName: 'Ties'                     },
			{field: 'points',              visible: false, displayName: 'Points'                   },
			{field: 'flag_drops',          visible: false, displayName: 'Flags Dropped'            },
			{field: 'flag_pickups',        visible: false, displayName: 'Flags Picked Up'          },
			{field: 'flag_returns',        visible: false, displayName: 'Flags Returned'           },
			{field: 'flag_scores',         visible: false, displayName: 'Flags Scored'             },
			{field: 'teleport_uses',       visible: false, displayName: 'Times Teleported'         },
			{field: 'asteroid_crashes',    visible: false, displayName: 'Asteroid Mishaps'         },
			{field: 'switched_team_count', visible: false, displayName: 'Team Switches'            },
			{field: 'last_played',         visible: false, displayName: 'Last Played'              }
		],
		data: 'stats'
	};

	$scope.periods = [];
	var i;
	var t;
	var data;
	for(i = 5; i >= 0; i--) {
		t = moment().subtract('month', i);
		data = {
			pretty: t.format('MMMM YYYY'),
			month: t.month(),
			year: t.year()
		};
		$scope.periods.push(data);
	}
	$scope.selectedPeriod = $scope.periods[5];

	$scope.$watch('selectedPeriod', getAllStats);
	$scope.$watch('selectedPeriod', getPlayerStats);
	$scope.$watch('selectedPlayer', getPlayerStats);

	getAllStats();
});

bfstats.controller('PlayerCtrl', function ($scope, $http) {
});

bfstats.filter('percentage', function() {
	return function(input) {
		var val = parseFloat(input) || 0;
		return (Math.round(val * 10000) / 100).toFixed(2) + '%';
	};
});