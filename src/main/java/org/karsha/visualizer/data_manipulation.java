package org.karsha.visualizer;

public class data_manipulation {
	
public static int[] H_index(int Hdata[][]) {

	int hindex[] = new int[29];
	
	for (int i = 0; i < Hdata[0].length; i++) {
		
		for (int j = 82; j >0; j--) {
			int count =0;
			for (int j2 = 0; j2 < Hdata.length; j2++) {
				if(Hdata[j2][i]>=j)count++;
			}
			if(count>=j){
				hindex[i] = j;
				break;
			}
		}
		
	}
	for (int i = 0; i < hindex.length; i++) {
		System.out.print(hindex[i]+" ");
	}
	
	return hindex;
}
}
