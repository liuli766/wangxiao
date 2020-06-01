#!/bin/bash
function func {
for name in $1*
do
if [ -d "$name" ]
then 
#	echo "$name is a d"
	func $name/ $2 $p
elif [ -f "$name" ]
then 
	echo "$name is a file"
	c=$2${1#*$p}
	if [ -d "$c" ]
	then
		mv -f $name $c
	else
		mkdir -p $c
		mv -f $name $c
	fi
fi
done
}
 
p=$1
#echo "$1 $2 $p"
func $1 $2 $p