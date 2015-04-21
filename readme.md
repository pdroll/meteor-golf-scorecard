#DG Scorecard App

## Collections

### Users
_Default Meteor User Model_

### Games

```
Games : {
	Users : [
		{
			name,
			index,
			score
			// Calculated from Games.Holes.Users.score
		},
		...
	],	
	Holes : [
		{
			Hole Number,
			Par,
			Users : [
				userIndex,
				score
			]
		},
		... 9 or 18 times ...
	],
	
	IsCompleted : bool,
	IsFavorite : bool,
	Date : DateTime,
	Course : string
}
```

### Courses

Simply used to prepopulate Games.Course & Games.Holes

```
Courses : {
	Name : string,
	Holes : {
		Number,
		Par
	}	
	lat : float,
	lng : float
}
```
