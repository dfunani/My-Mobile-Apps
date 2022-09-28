package com.example.tipcalculator

import android.R
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import com.example.tipcalculator.databinding.ActivityMainBinding
import java.text.NumberFormat
import kotlin.math.round

class MainActivity : AppCompatActivity() {

    lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.button.setOnClickListener{ calculateTip() }
    }

    private fun calculateTip()
    {
        when(binding.radioBtn.checkedRadioButtonId)
        {
            binding.radio1.id -> calculator(20)
            binding.radio2.id -> calculator(18)
            binding.radio3.id -> calculator(15)
        }
    }

    fun calculator(percentage: Int)
    {
        var currFormat = NumberFormat.getCurrencyInstance()

        Log.d("Radio: ${binding.textInputEditText.text}", "calculator: ${binding.textInputEditText}")
        Log.d("Radio: ${currFormat.format(kotlin.math.ceil(percentage/100 * binding.textInputEditText.text.toString().toFloat())).toString()}", "calculator: ${(percentage).toFloat()}")
        if(binding.switchState.isChecked)
        {
            binding.tipAmount.text = "Tip Amount: " + currFormat.format(kotlin.math.ceil(percentage / 100.00 * binding.textInputEditText.text.toString().toFloat())).toString()
        }
        else
        {
            binding.tipAmount.text = "Tip Amount: " + currFormat.format(percentage / 100.00 * binding.textInputEditText.text.toString().toFloat()).toString()
        }

    }
}